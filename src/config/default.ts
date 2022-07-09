const portNum =
  process.env.PORT !== undefined ? parseInt(process.env.PORT) : 4500;

export default {
  appPort: portNum,
  appHost: "localhost",
  dbUrl: "",
};
