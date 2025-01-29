setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(JSON.stringify(memoryUsage));
}, 1000);

const recursiveFetchIngest = async () => {
  try {
    await (await fetch("http://localhost:3000/test")).json();
  } catch (e) {
    console.error(e);
  }

  return recursiveFetchIngest();
};

recursiveFetchIngest();
