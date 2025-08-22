import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      apply: 'build',
      writeBundle() {
        fs.copyFileSync("public/404.html", "dist/404.html");
      },
    }
  ],
  base: "/map_manager_example_frontend_usage/", // Replace YOUR_REPO_NAME with your actual GitHub repository name
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: "client", // Keep client as root
  build: {
    outDir: "../dist", // Output to project root dist folder
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