import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const dir = "./dist";
const port = 4001;

serve(
  async (req) => {
    const url = new URL(req.url);
    let path = url.pathname;

    // Remove leading slash and handle root
    if (path === "/" || path === "") {
      path = "index.html";
    } else if (!path.includes(".")) {
      // No file extension = client-side route, serve index.html
      path = "index.html";
    }

    try {
      const file = await Deno.readFile(`${dir}${path}`);
      const contentType = path.endsWith(".js")
        ? "application/javascript"
        : path.endsWith(".css")
          ? "text/css"
          : path.endsWith(".html")
            ? "text/html"
            : "application/octet-stream";

      return new Response(file, {
        headers: { "content-type": contentType },
      });
    } catch {
      // Fallback to index.html for any missing files
      try {
        const file = await Deno.readFile(`${dir}/index.html`);
        return new Response(file, {
          status: 200,
          headers: { "content-type": "text/html" },
        });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    }
  },
  { port },
);

console.log(`Frontend server running on http://localhost:${port}`);
