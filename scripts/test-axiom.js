import { Axiom } from "@axiomhq/js";

const axiom = new Axiom({
  token: "xaat-5d354a65-645e-48e6-9b97-8697a7489e3a",
  url: "http://localhost:3000",
});

setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(JSON.stringify({ ...memoryUsage, _time: Date.now() }));
}, 1000);

const recursiveIngest = async () => {
  axiom.ingest("test", [{ test: "test" }]);
  await axiom.flush();
  console.log("Done");
  return recursiveIngest();
};
