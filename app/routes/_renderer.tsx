import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { HasIslands, Link, Script } from "honox/server";

export default jsxRenderer(({ children, frontmatter }) => {
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{frontmatter.title}</title>
        <link rel='icon' href='/favicon.ico' />
        <Link href='/app/style.css' rel='stylesheet' />
        <HasIslands>
          <Script src='/app/client.ts' async />
        </HasIslands>
        <Style />
      </head>
      <body>{children}</body>
    </html>
  );
});
