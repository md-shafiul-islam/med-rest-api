import { join } from "path";
import { DataSourceOptions } from "typeorm";

export const dbConnectionOption = (): DataSourceOptions => {
  // console.log("__dirname, ", __dirname + "/../model/*{.js,.ts}");
  return {
    type: "mysql",
    host: "bullet.itnut.net",
    port: 3306,
    username: "qlosprmw_md_shafiul",
    password: "p~!T3Lj+-8Y5",
    database: "qlosprmw_bc_bd",
    logging: false,
    synchronize: true,
    entities: [join(__dirname, "..", "model", "*{.js,.ts}")],
  };
};
