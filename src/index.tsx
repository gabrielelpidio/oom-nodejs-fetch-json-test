import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { html, raw } from "hono/html";
import fs from "node:fs";
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

const htmlServer = new Hono();

const readNDJSON = (path: string) => {
  const file = fs.readFileSync(path, "utf8");

  return file
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return;
      }
    })
    .filter(Boolean);
};

htmlServer.get("*", (c) => {
  const data = readNDJSON("./stats/d500-6.json").flatMap((d) => {
    const keys = Object.keys(d).filter((key) =>
      ["heapUsed", "rss", "heapTotal"].includes(key)
    );

    return keys.map((key) => ({
      key,
      value: d[key],
      _time: d._time,
    }));
  });

  const dataString = JSON.stringify(data);
  const url = new URL(c.req.url);
  const reload = url.searchParams.get("reload") === "true";

  return c.html(
    <html>
      <body>
        <label htmlFor="reload">
          <input
            type="checkbox"
            id="reload"
            defaultChecked={reload}
            style={{ marginRight: 4 }}
          />
          Reload automatically
        </label>

        <div id="plot"></div>
        <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
        <script src="https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6"></script>
        {html`
          <script type="module">
            const keys = ["heapUsed", "rss", "heapTotal"];
            const data = ${raw(dataString)}.map((d) => ({
              key: d.key,
              value: d.value / 1024 / 1024,
              _time: new Date(d._time),
            }));

            const plot = Plot.plot({
              width: document.body.clientWidth - 100,
              height: document.body.clientHeight - 100,
              fy: {
                axis: null,
              },
              marks: [
                Plot.frame(),
                Plot.lineY(data, {
                  x: "_time",
                  y: "value",
                  fy: "key",
                  stroke: "key",
                }),
                Plot.text(keys, {
                  fy: (d) => d,
                  frameAnchor: "top-left",
                  dx: 6,
                  dy: 6,
                }),
              ],
            });

            const div = document.querySelector("#plot");
            div.append(plot);

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          </script>
        `}
      </body>
    </html>
  );
});

serve({
  fetch: htmlServer.fetch,
  port: 3001,
});

console.log(`Visualizations are running on http://localhost:${port}`);
