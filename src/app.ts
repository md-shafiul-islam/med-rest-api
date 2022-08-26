import "dotenv/config";
import "reflect-metadata";
import express, { Application } from "express";
import { DataSource } from "typeorm";

import config from "./config/default";
import log from "./logger/index";
import routes from "./routes";
import { AppDataSource } from "./database/AppDataSource";
import errorMiddleware from "./middleware/error.middleware";
import { initialController } from "./controller/initial.controller";
import bodyParser from "body-parser";

class App {
  port = config.appPort as number;
  host = config.appHost as string;
  env = "";

  dataSource: DataSource;

  public app: Application;

  constructor() {
    this.app = express();

    this.connectToDatabase();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeErrorHandling() {
    //TODO: Error Handeler
  }
  initializeRoutes() {
    routes(this.app);
  }
  initializeMiddlewares() {
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(errorMiddleware);
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    this.dataSource = AppDataSource;
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      log.info(`=================================`);
      log.info(`======= ENV: ${this.env} =======`);
      log.info(`🚀 App listening on the port http://${this.host}:${this.port}`);
      log.info(`******************** ************** ******************* `);
    });
  }
}

export default App;
