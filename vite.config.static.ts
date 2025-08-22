import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404",
      apply: "build",
      writeBundle() {
        // Copy built index.html → dist/404.html (SPA fallback)
        fs.copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
  base: "/map_manager_example_frontend_usage/", // correct for GH Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: "client", // app starts from client/
  build: {
    outDir: "../dist", // output dist/ at root
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
