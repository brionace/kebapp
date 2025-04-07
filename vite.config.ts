import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "https://kebapp-sage.vercel.app" // Vercel URL for production
            : "http://localhost:5001", // TODO: fix
        changeOrigin: true,
        // secure: false,
        // ws: true,
      },
    },
  },
});
