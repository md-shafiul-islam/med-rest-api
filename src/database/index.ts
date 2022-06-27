import { DataSourceOptions } from "typeorm";

export const dbConnectionOption = ():DataSourceOptions => {
  // console.log("__dirname, ", __dirname + "/../model/*{.js,.ts}");
  return {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "med_shafiul",
    password: "01933408421S",
    database: "med",
    logging: false,
    synchronize: true,
    entities: [__dirname + "/../model/*{.js,.ts}"],
  };
};


