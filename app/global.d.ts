import {} from "hono";

type Head = {
  frontmatter: {
    title: string;
    isClient: boolean;
  };
};

declare module "hono" {
  interface Env {
    Variables: {};
    Bindings: {};
  }
  interface ContextRenderer {
    (content: string | Promise<string>, head?: Head):
      | Response
      | Promise<Response>;
  }
}
