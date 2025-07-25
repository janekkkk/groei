import type { Context } from "hono";

function notFound({ json, req }: Context): Response {
  return json({ message: `🔍 - Not Found - ${req.path}` }, 404);
}

export default { notFound };
