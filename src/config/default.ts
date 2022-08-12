const portNum =
  process.env.PORT !== undefined ? parseInt(process.env.PORT) : 1010;

export default {
  appPort: portNum,
  appHost: "localhost",
  dbUrl: "",
};
