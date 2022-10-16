import { join } from "path";
import { DataSourceOptions } from "typeorm";

export const dbConnectionOption = (): DataSourceOptions => {
  // console.log("__dirname, ", __dirname + "/../model/*{.js,.ts}");
  return {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "md_shafiul",
    password: "01725^*^)@(Sa",
    database: "i4f1wre6q8fbk5sp",
    logging: false,
    synchronize: true,
    entities: [join(__dirname, "..", "model", "*{.js,.ts}")],
  };
};
