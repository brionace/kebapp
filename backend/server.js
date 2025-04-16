import dotenv from "dotenv";
import fs from "fs";
import express from "express";
// import serverless from "serverless-http";
import cors from "cors";
import { build } from "vite";
import path from "path";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import AWS from "@aws-sdk/client-s3";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const bucketName = "kebapps";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const dirName =
//   process.env.NODE_ENV === "production"
//     ? "https://kebapps.s3-website.us-east-2.amazonaws.com/tmp"
//     : __dirname;
const dirName = __dirname;

// const SESConfig = {
//   apiVersion: "latest",
//   region: process.env.REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// };

// AWS.config.update(SESConfig);

// // Debug credentials
// AWS.config.getCredentials((err) => {
//   if (err) {
//     console.error("Error loading credentials:", err);
//   } else {
//     console.log("Credentials loaded successfully:", AWS.config.credentials);
//   }
// });

const s3 = new AWS.S3();

// Enable CORS for all routes
app.use(cors());

// Restrict CORS to a specific origin (uncomment if needed)
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace with your React app's URL
//   })
// );
// Enable CORS for all routes
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow requests from your React app
//     methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
//     allowedHeaders: ["Content-Type"], // Allow these headers
//   })
// );

app.use(express.json()); // To parse JSON request bodies

// Serve the built files
// app.use(
//   "/api/preview",
//   express.static(path.resolve(__dirname, "projects"))
// );

app.use("/api/preview/:projectId", (req, res, next) => {
  const projectId = req.params.projectId; // Extract projectId from the URL
  const userBuildDir = path.resolve(dirName, "projects", projectId);

  if (!fs.existsSync(userBuildDir)) {
    return res
      .status(404)
      .send({ error: "Build not found for the specified project" });
  }

  express.static(userBuildDir)(req, res, next); // Serve static files from the user's build directory
});

// Endpoint to trigger the build process
app.post("/api/build", async (req, res) => {
  try {
    const projectId = req.body.projectId || uuidv4(); // Use projectId from the request or generate a UUID

    const outputDir = path.resolve(__dirname, "projects", projectId);

    const bundleTSX = `bundle-${projectId}.tsx`;
    const bundleFile = path.resolve(__dirname, bundleTSX);

    const htmlFile = path.resolve(outputDir, "index.html");

    // Ensure the build directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Write the entry.tsx file
    const entryFileContent = `
      import React from "react";
      import ReactDOM from "react-dom/client"; 
      import { TEMPLATE_REGISTRY } from "../src/templates/index";
      import "../src/index.css"; // Import Tailwind CSS

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
    fs.writeFileSync(bundleFile, entryFileContent, "utf8");

    // Use Vite to build the static files
    await build({
      root: path.resolve(__dirname),
      build: {
        outDir: outputDir,
        manifest: true,
        rollupOptions: {
          input: bundleFile,
        },
      },
    });

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

    // console.log(`Created entry file at ${bundleFile}`);
    // console.log(`Created HTML file at ${htmlFile}`);

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

// Endpoint to download the build as a ZIP file
app.get("/api/download", async (req, res) => {
  try {
    const zip = new JSZip();
    const outputDir = path.resolve(dirName, "build");

    // Add files to the ZIP
    const addFilesToZip = (dir, folder) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          const subFolder = folder.folder(file);
          addFilesToZip(filePath, subFolder);
        } else {
          folder.file(file, fs.readFileSync(filePath));
        }
      });
    };

    addFilesToZip(outputDir, zip);

    // Generate the ZIP file
    const content = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Disposition", "attachment; filename=build.zip");
    res.setHeader("Content-Type", "application/zip");
    res.send(content);
  } catch (error) {
    console.error("Error generating ZIP:", error);
    res.status(500).send({ error: "Failed to generate ZIP" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// export const handler = serverless(app, {
//   // Custom options for serverless-http
//   request: (req, res) => {
//     // Custom request handling logic
//     console.log("Request received:", req.method, req.url);
//   },
//   response: (req, res) => {
//     // Custom response handling logic
//     console.log("Response sent:", res.statusCode);
//   },
// });
