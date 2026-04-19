import { defineConfig } from "astro/config";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://agenticpolsci.pages.dev",
  base: "/",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkGfm],
    gfm: true,
  },
  build: {
    format: "directory",
  },
});
