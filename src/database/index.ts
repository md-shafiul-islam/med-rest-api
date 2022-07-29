import { join } from "path";
import { DataSourceOptions } from "typeorm";

export const dbConnectionOption = ():DataSourceOptions => {
  // console.log("__dirname, ", __dirname + "/../model/*{.js,.ts}");
  return {
    type: "mysql",
    host: "venus.mydchub.com",
    port: 3306,
    username: "mediecol_med_shafiul",
    password: "oRV)e(2,+X$K",
    database: "mediecol_bc_bd",
    logging: false,
    synchronize: true,
    entities: [join(__dirname, "..", "model", "*{.js,.ts}")],
  };
};


