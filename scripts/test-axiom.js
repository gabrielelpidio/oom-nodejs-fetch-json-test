import { Axiom } from "@axiomhq/js";
import "dotenv/config";

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN,
  url: "http://localhost:3000",
});

setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(JSON.stringify({ ...memoryUsage, _time: Date.now() }));
}, 1000);

const recursiveIngest = async () => {
  axiom.ingest("test", [{ test: "test" }]);
  await axiom.flush();
  return recursiveIngest();
};

recursiveIngest();
