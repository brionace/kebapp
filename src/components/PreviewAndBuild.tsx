import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Globe, Package, Code2, X, ArrowRight } from "lucide-react";
import JSZip from "jszip";
import { TEMPLATES } from "../data/templates";

const BUILD_STEPS = [
  "Preparing template files",
  "Generating static content",
  "Creating deployment package",
];

interface DeploymentProvider {
  id: string;
  name: string;
  logo: string;
  steps: {
    title: string;
    description: string;
  }[];
}

const DEPLOYMENT_PROVIDERS: DeploymentProvider[] = [
  {
    id: "netlify",
    name: "Netlify",
    logo: "https://www.netlify.com/v3/img/components/logomark-dark.png",
    steps: [
      {
        title: "Download the build",
        description:
          'Click the "Download Static Build" button to get your website files.',
      },
      {
        title: "Create a Netlify account",
        description:
          "Sign up for a free Netlify account at netlify.com if you haven't already.",
      },
      {
        title: "Deploy your site",
        description:
          "Go to Netlify, drag and drop your build folder, or connect your GitHub repository.",
      },
      {
        title: "Configure your domain",
        description:
          "Set up a custom domain or use the free Netlify subdomain.",
      },
    ],
  },
];

export function PreviewAndBuild() {
  const { projectId } = useParams();
  const location = useLocation();
  const [building, setBuilding] = useState(false);
  // const [projectId, setProjectId] = useState(sessionStorage.getItem("projectId"));
  const [currentStep, setCurrentStep] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);
  const [isDeploymentSidebarOpen, setIsDeploymentSidebarOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<DeploymentProvider | null>(null);
  const templateConfig = location.state?.config;
  const templateType = location.state?.templateType;
  const template = TEMPLATES.find((t) => t.category === templateType);
  const url =
    process.env.NODE_ENV === "production"
      ? "http://ec2-18-226-200-141.us-east-2.compute.amazonaws.com" // Vercel URL for production
      : "http://localhost:5000";
  // const url = "https://twx7oosbtf.execute-api.us-east-2.amazonaws.com/default";

  useEffect(() => {
    const fetchBuildResult = async () => {
      try {
        await handleGenerateStaticPage();
      } catch (error) {
        console.error("Error generating static page:", error);
      }
    };

    fetchBuildResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleBuild();
  }, [projectId]);

  const handleBuild = async () => {
    setBuilding(true);
    setBuildComplete(false);
    setCurrentStep(0);

    try {
      // Simulate build steps
      for (let i = 0; i < BUILD_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setBuildComplete(true);
    } catch (error) {
      console.error("Build error:", error);
    } finally {
      setBuilding(false);
    }
  };

  const handleHost = (provider: DeploymentProvider) => {
    setSelectedProvider(provider);
    setIsDeploymentSidebarOpen(true);
  };

  const handleGenerateStaticPage = async () => {
    setBuilding(true);

    try {
      // Trigger the build process on the server
      const response = await fetch(`${url}/api/build`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          templateId: template?.id, // Replace with the actual template ID
          templateConfig,
        }),
      });

      if (response.ok) {
        // const { projectId } = await response.json();
        // add to session storage
        // sessionStorage.setItem("projectId", projectId || "");
        // setProjectId(projectId);
      }

      throw new Error("Failed to generate static page");
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setBuilding(false);
    }
  };

  const handleDownloadStatic = async () => {
    try {
      const zip = new JSZip();

      // Add Next.js configuration
      zip.file(
        "next.config.js",
        `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }
}
module.exports = nextConfig
      `
      );

      // Add package.json
      zip.file(
        "package.json",
        JSON.stringify(
          {
            name: "my-nextjs-site",
            version: "0.1.0",
            private: true,
            scripts: {
              dev: "next dev",
              build: "next build",
              start: "next start",
            },
            dependencies: {
              next: "^14.0.0",
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              tailwindcss: "^3.4.1",
              autoprefixer: "^10.4.18",
              postcss: "^8.4.35",
            },
          },
          null,
          2
        )
      );

      // Add pages
      const pagesDir = zip.folder("pages");
      pagesDir?.file(
        "index.tsx",
        templateType === "landing"
          ? "generateLandingPage()"
          : "generateBlogPage()"
      );

      pagesDir?.file(
        "_app.tsx",
        `
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
      `
      );

      // Add styles
      const stylesDir = zip.folder("styles");
      stylesDir?.file(
        "globals.css",
        `
@tailwind base;
@tailwind components;
@tailwind utilities;
      `
      );

      // Add configuration files
      zip.file(
        "tailwind.config.js",
        `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
      `
      );

      zip.file(
        "postcss.config.js",
        `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
      `
      );

      // Add tsconfig.json
      zip.file(
        "tsconfig.json",
        `
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
      `
      );

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectId}-${
        template?.framework || "nextjs"
      }-project.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating zip:", error);
    }
  };

  const handleDownloadBuild = async () => {
    try {
      // Fetch the ZIP file from the backend
      const response = await fetch("/api/download", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download the build");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectId}-static-build.zip`; // Set the file name
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading build:", error);
    }
  };

  const getFrameworkName = () => {
    switch (template?.framework) {
      case "nextjs":
        return "Next.js";
      case "react":
        return "React";
      default:
        return "Next.js";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center">
            Now What?
          </h2>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Take it! Download or Deploy your project wherever you want.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {building ? (
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep + 1) / BUILD_STEPS.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-sm text-gray-600">
              {BUILD_STEPS[currentStep]}...
            </div>
          </div>
        ) : buildComplete ? (
          <>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-6">
              <iframe
                src={`${url}/api/preview/${projectId}`}
                className="w-full h-full rounded-lg"
                title="Preview"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDownloadBuild}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                <Code2 className="h-4 w-4 mr-2" />
                Download Static Build
              </button>

              <button
                onClick={handleDownloadStatic}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                <Package className="h-4 w-4 mr-2" />
                Download {getFrameworkName()} Project
              </button>

              <button
                onClick={() => handleHost(DEPLOYMENT_PROVIDERS[0])}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                <Globe className="h-4 w-4 mr-2" />
                Deploy to Netlify
              </button>
            </div>
          </>
        ) : null}
      </div>

      {/* Deployment Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDeploymentSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {selectedProvider && (
                <img
                  src={selectedProvider.logo}
                  alt={selectedProvider.name}
                  className="h-6 w-6"
                />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                Deploy to {selectedProvider?.name}
              </h3>
            </div>
            <button
              aria-label="Close"
              onClick={() => setIsDeploymentSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {selectedProvider?.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < selectedProvider.steps.length - 1 && (
                    <div className="absolute left-4 top-8 h-full">
                      <div className="h-full w-0.5 bg-indigo-100"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <a
              href="https://app.netlify.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Go to Netlify
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
