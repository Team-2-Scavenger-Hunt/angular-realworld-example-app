import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          http: ["axios"],
          markdown: ["marked"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    assetsDir: "assets",
  },
  server: {
    port: 4200,
    open: true,
  },
  define: {
    "process.env": {},
  },
});
