import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("*", () => {
  return new Response("", { status: 200 });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
