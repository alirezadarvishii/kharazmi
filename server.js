const createApp = require("./app");

const app = createApp();

const { PORT, NODE_ENV = "production" } = process.env;

app.listen(PORT, () =>
  console.log(`Server Runing On Port: ${PORT}, mode: ${NODE_ENV}! (:`),
);
