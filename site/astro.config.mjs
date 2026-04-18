import { defineConfig } from "astro/config";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://example.github.io",
  base: "/agenticPolSci",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkGfm],
    gfm: true,
  },
  build: {
    format: "directory",
  },
});
