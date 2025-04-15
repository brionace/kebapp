import dotenv from "dotenv";
import os from "os";
import fsPromises from "fs/promises";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { build } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import AWS from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url); // Get the current file's absolute path
const __dirname = path.dirname(__filename); // Get the directory of the current file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const s3 = new AWS.S3();
const bucketName = "kebapps";

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.post("/api/build", async (req, res) => {
  try {
    const projectId = req.body.projectId || uuidv4(); // Use projectId from the request or generate a UUID
    // Create a temporary directory for the build
    const tempDir = path.join(os.tmpdir(), `vite-build-${projectId}`);
    await fsPromises.mkdir(tempDir, { recursive: true });

    const outputDir = path.resolve(tempDir, "projects", projectId);
    const htmlFile = path.resolve(outputDir, "index.html");

    // Dynamically generate the entry file content as a string
    const entryFileContent = `
      import React from "react";
      import ReactDOM from "react-dom/client";
      import { TEMPLATE_REGISTRY } from "${__dirname}/src/templates/index.ts";
      import "${__dirname}/src/index.css"; // Import Tailwind CSS

      const config = ${JSON.stringify(req.body.templateConfig)};
      const TemplateComponent = TEMPLATE_REGISTRY["${req.body.templateId}"];

      if (!TemplateComponent) {
        throw new Error("TemplateComponent not found in TEMPLATE_REGISTRY");
      }

      const rootElement = document.getElementById("root");
      if (!rootElement) {
        throw new Error("Root element not found in the DOM");
      }

      const root = ReactDOM.createRoot(rootElement); // Use createRoot for React 18+
      root.render(React.createElement(TemplateComponent, { config }));
    `;

    // Write the entry file to the temporary directory
    const entryFilePath = path.join(tempDir, "entry.tsx");
    await fsPromises.writeFile(entryFilePath, entryFileContent, "utf8");

    // Perform the Vite build
    await build({
      root: tempDir, // Use the temporary directory as the root
      build: {
        outDir: outputDir, // Output directory for the build
        manifest: true, // Generate a manifest file
        rollupOptions: {
          input: entryFilePath, // Use the dynamically created entry file
          external: ["react", "react-dom", "react-dom/client"], // Exclude React and ReactDOM from the bundle
        },
      },
    });

    // Clean up the temporary directory (optional)
    await fsPromises.rm(tempDir, { recursive: true, force: true });

    // Read the manifest.json file AFTER the build process
    const manifestPath = path.resolve(outputDir + "/.vite", "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      throw new Error("Manifest file not found after build");
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Get the output file name for the entry file
    const bundleFileName = manifest[bundleTSX]?.file;
    const cssFileName = manifest[bundleTSX]?.css[0];
    if (!bundleFileName) {
      throw new Error("Bundle file not found in manifest.json");
    }

    // Check if the entry file exists, and create it if it doesn't
    fs.writeFileSync(
      htmlFile,
      `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta http-equiv="content-type" content="text/html; charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${req.body.templateConfig.title || "Generated Page"}</title>
            <link rel="stylesheet" href="${cssFileName}" />
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="./${bundleFileName}"></script>
          </body>
        </html>
      `,
      "utf8"
    ); // Create the file with the content

    console.log(`Created HTML file at ${htmlFile}`);

    // Get file paths
    const filePaths = [];
    const getFilePaths = (dir) => {
      fs.readdirSync(dir).forEach(function (name) {
        const filePath = path.join(dir, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          filePaths.push(filePath);
        } else if (stat.isDirectory()) {
          getFilePaths(filePath);
        }
      });
    };

    getFilePaths(outputDir);

    // Map file extensions to MIME types
    const getContentType = (filename) => {
      const ext = filename.split(".").pop().toLowerCase();
      const mimeTypes = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        png: "image/png",
        jpg: "image/jpeg",
        json: "application/json",
      };
      return mimeTypes[ext] || "application/octet-stream";
    };

    // Upload to S3
    const uploadToS3 = (dir, path) => {
      return new Promise((resolve, reject) => {
        const key = path.split(`${dir}/`)[1];
        const params = {
          Bucket: bucketName,
          Key: `${projectId}/${key}`,
          Body: fs.readFileSync(path),
          ContentType: getContentType(key), // Critical for rendering!
        };
        s3.putObject(params, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`uploaded ${params.Key} to ${params.Bucket}`);
            resolve(path);
          }
        });
      });
    };

    const uploadPromises = filePaths.map((path) => uploadToS3(outputDir, path));
    Promise.all(uploadPromises)
      .then((result) => {
        console.log("uploads complete");
        console.log(result);
      })
      .catch((err) => console.error(err));

    res
      .status(200)
      .send({ message: "Build completed successfully", projectId });
  } catch (error) {
    console.error("Build Error:", error);
    res.status(500).send({ error: "Build failed" });
  }
});

export const handler = serverless(app, {
  // Custom options for serverless-http
  request: (req, res) => {
    // Custom request handling logic
    console.log("Request received:", req.method, req.url);
  },
  response: (req, res) => {
    // Custom response handling logic
    console.log("Response sent:", res.statusCode);
  },
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
