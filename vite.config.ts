import build from "@hono/vite-build/cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import ssg from "@hono/vite-ssg";
import { defineConfig } from "vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import mdx from "@mdx-js/rollup";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { glob } from "glob";

const extractMetaFromMDX = () => {
  return {
    name: "extract-mdx-meta",
    enforce: "pre" as const, // "as const" を使って型指定
    transform(code: string, id: string) {
      if (id.endsWith(".mdx")) {
        // フロントマターのメタデータを抽出
        const { data } = matter(code);
        // メタデータはそのままエクスポートし、ファイル内容はそのまま返す
        return `${code}\nexport const meta = ${JSON.stringify(data)};`;
      }
      return null;
    },
    async buildEnd() {
      const dirPattern = path.resolve(__dirname, "app/**/*.mdx"); // ワイルドカードパターン
      const files = glob.sync(dirPattern); // 再帰的にファイルを取得
      const metas = [];

      for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        const { data } = matter(content);

        // "routes" と "index" を削除したパスに変換
        let formattedPath = file
          .replace(`${__dirname}/app/`, "")
          .replace(".mdx", "");

        // ルートの "routes/index" は "/" に設定し、その他は "routes/" と "/index" を削除
        if (formattedPath === "routes/index") {
          formattedPath = "/";
        } else {
          formattedPath = formattedPath
            .replace(/routes\//, "")
            .replace(/\/index$/, "");
          formattedPath = `/${formattedPath}`; // パスの先頭に "/" を追加
        }

        metas.push({
          title: data.title,
          description: data.description,
          path: formattedPath,
        });
      }

      // JSON ファイルとしてメタ情報を保存
      fs.writeFileSync(
        path.resolve(__dirname, "public/mdxMeta.json"),
        JSON.stringify(metas, null, 2)
      );
    },
  };
};

const entry = "./app/server.ts";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "static",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        assetFileNames: "static/[name].[ext]",
        chunkFileNames: "static/[name].js",
        entryFileNames: "static/[name].js",
      },
    },
  },
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
    extractMetaFromMDX(),
  ],
});
