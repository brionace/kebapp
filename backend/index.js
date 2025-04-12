const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Serve the built files
app.use("/api/preview/:projectId", (req, res, next) => {
  const projectId = req.params.projectId; // Extract projectId from the URL
  const userBuildDir = path.resolve("/tmp", "projects", projectId);

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
    const outputDir = path.resolve("/tmp", "projects", projectId);
    const entryFile = path.resolve("/tmp", "bundle.tsx");
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
    fs.writeFileSync(entryFile, entryFileContent, "utf8");

    // Use esbuild to bundle the static files
    await esbuild.build({
      entryPoints: [entryFile],
      bundle: true,
      outfile: path.resolve(outputDir, "bundle.js"),
      minify: true,
      platform: "browser",
      target: ["es2017"],
    });

    // Create the HTML file
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${req.body.templateConfig.title || "Generated Page"}</title>
          <link rel="stylesheet" href="../src/index.css" />
        </head>
        <body>
          <div id="root"></div>
          <script src="./bundle.js"></script>
        </body>
      </html>
    `;
    fs.writeFileSync(htmlFile, htmlContent, "utf8");

    console.log(`Created entry file at ${entryFile}`);
    console.log(`Created HTML file at ${htmlFile}`);

    // Upload files to S3
    const bucketName = "kebapps";

    const uploadToS3 = async (key, filePath) => {
      const fileContent = fs.readFileSync(filePath);
      await s3
        .upload({
          Bucket: bucketName,
          Key: key,
          Body: fileContent,
        })
        .promise();
      console.log(`Uploaded ${key} to S3`);
    };

    // Upload bundle.js and index.html
    await uploadToS3(
      `projects/${projectId}/bundle.js`,
      path.resolve(outputDir, "bundle.js")
    );
    await uploadToS3(`projects/${projectId}/index.html`, htmlFile);

    res.status(200).send({
      message: "Build completed and uploaded to S3",
      projectId,
      s3Urls: {
        bundle: `https://${bucketName}.s3.amazonaws.com/projects/${projectId}/bundle.js`,
        html: `https://${bucketName}.s3.amazonaws.com/projects/${projectId}/index.html`,
      },
    });
  } catch (error) {
    console.error("Build Error:", error);
    res.status(500).send({ error: "Build failed", details: error.message });
  }
});

// Endpoint to download the build as a ZIP file
app.get("/api/download", async (req, res) => {
  try {
    const zip = new JSZip();
    const outputDir = path.resolve("/tmp", "build");

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

// Export the app for serverless deployment
module.exports.handler = serverless(app, {
  request: (req, res) => {
    console.log("Request received:", req.method, req.url);
  },
  response: (req, res) => {
    console.log("Response sent:", res.statusCode);
  },
});
