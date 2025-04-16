import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = process.env.PORT || 3000; // Default port for local development
const url =
  process.env.NODE_ENV === "production"
    ? `http://172.31.7.229:${port}` // Vercel URL for production
    : `http://localhost:${port}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react", "fsevents"],
  },
  build: {
    rollupOptions: {
      external: ["fsevents"], // Exclude fsevents from the bundle
    },
    commonjsOptions: {
      include: /node_modules/, // Ensure CommonJS dependencies are included
      transformMixedEsModules: true, // Ensure mixed ES modules are handled correctly
    },
  },
  server: {
    host: true,
    port: 80,
    proxy: {
      "/api": {
        target: url,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
