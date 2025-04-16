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
    host: true,
    port: 80,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || 5000}`, // TODO: fix
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
