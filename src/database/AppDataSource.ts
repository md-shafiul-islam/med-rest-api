import { DataSource } from "typeorm";
import { dbConnectionOption } from ".";
import { initialController } from "../controller/initial.controller";

const AppDataSource = new DataSource(dbConnectionOption());

AppDataSource.initialize()
  .then(() => {
    console.log("DB Connection ");
    // initialController.initSaveAllGeniric();
  })
  .catch((err) => {
    console.log("Connection Error, ", err);
  });

export { AppDataSource };
