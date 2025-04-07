const express = require("express");
const cors = require("cors");
const { build } = require("vite");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5001;

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
//   express.static(path.resolve(__dirname, "builds"))
// );

app.use("/api/preview/:projectId", (req, res, next) => {
  const projectId = req.params.projectId; // Extract projectId from the URL
  const userBuildDir = path.resolve(__dirname, "builds", projectId);

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
    const outputDir = path.resolve(__dirname, "builds", projectId);
    const entryFile = path.resolve(__dirname, "bundle.tsx");
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

    // Use Vite to build the static files
    await build({
      root: path.resolve(__dirname),
      build: {
        outDir: outputDir,
        manifest: true,
        rollupOptions: {
          input: entryFile,
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
    const bundleFileName = manifest["bundle.tsx"]?.file;
    const cssFileName = manifest["bundle.tsx"]?.css[0];
    if (!bundleFileName) {
      throw new Error("Bundle file not found in manifest.json");
    }

    // Check if the entry file exists, and create it if it doesn't
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${req.body.templateConfig.title || "Generated Page"}</title>
            <link rel="stylesheet" href="${cssFileName}" />
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="./${bundleFileName}"></script>
          </body>
        </html>
      `;
    fs.writeFileSync(htmlFile, htmlContent, "utf8"); // Create the file with the content

    console.log(`Created entry file at ${entryFile}`);
    console.log(`Created HTML file at ${htmlFile}`);

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
    const outputDir = path.resolve(__dirname, "build");

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
