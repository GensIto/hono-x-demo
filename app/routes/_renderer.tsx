import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { HasIslands, Link, Script } from "honox/server";
import Header from "../islands/header";

export default jsxRenderer(({ children, frontmatter }) => {
  const title = frontmatter?.title ?? "";
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
        <Link href='/app/style.css' rel='stylesheet' />
        {import.meta.env.PROD ? (
          <script type='module' async src='/static/client.js'></script>
        ) : (
          <script src='/app/client.ts' async />
        )}
        <Style />
      </head>
      <body>
        {import.meta.env.PROD && "PROD"}
        <Header />
        {children}
      </body>
    </html>
  );
});
