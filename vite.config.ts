import build from "@hono/vite-build/cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import ssg from "@hono/vite-ssg";
import { defineConfig } from "vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import mdx from "@mdx-js/rollup";

const entry = "./app/server.ts";

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: {
        input: ["./app/style.css"],
      },
    }),
    mdx({
      jsxImportSource: "hono/jsx",
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    build(),
    ssg({ entry }),
  ],
});
