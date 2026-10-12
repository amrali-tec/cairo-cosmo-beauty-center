// vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  build: {
    minify: "esbuild",
    cssMinify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("react-router")) return "router";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@radix-ui")) return "radix";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
