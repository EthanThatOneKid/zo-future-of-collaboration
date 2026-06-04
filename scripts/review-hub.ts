const port = Number(process.env.REVIEW_HUB_PORT ?? 5300);
const root = new URL("../examples/", import.meta.url);

Bun.serve({
  port,
  fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/" || path === "/review-index.html") {
      return new Response(Bun.file(new URL("review-index.html", root)));
    }
    if (path === "/review-manifest.json") {
      return new Response(Bun.file(new URL("review-manifest.json", root)));
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Review hub: http://localhost:${port}/review-index.html`);
