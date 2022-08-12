import { join } from "path";
import { DataSourceOptions } from "typeorm";

export const dbConnectionOption = (): DataSourceOptions => {
  // console.log("__dirname, ", __dirname + "/../model/*{.js,.ts}");
  return {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "med_shafiul",
    password: "01725686029Sa",
    database: "med",
    logging: false,
    synchronize: true,
    entities: [join(__dirname, "..", "model", "*{.js,.ts}")],
  };
};
