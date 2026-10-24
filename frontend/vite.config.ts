import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom|scheduler)\//,
            },
            {
              name: "charts-vendor",
              test: /node_modules\/(recharts|d3-[^/]+)\//,
            },
            {
              name: "markdown-vendor",
              test: /node_modules\/(react-markdown|remark-[^/]+|rehype-[^/]+|unified|micromark[^/]*)\//,
            },
            {
              name: "motion-vendor",
              test: /node_modules\/(framer-motion|motion-dom|motion-utils)\//,
            },
            {
              name: "vendor",
              test: /node_modules\//,
            },
          ],
        },
      },
    },
  },
});
