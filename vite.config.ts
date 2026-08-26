import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base keeps the build portable: it works from a GitHub Pages
// project path (/my_portfolio.github.io/) and from a domain root alike.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "static",
    sourcemap: false,
  },
});
