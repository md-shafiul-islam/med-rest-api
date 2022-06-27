
import express from "express";
import { initialController } from "../controller/initial.controller";


const initialRoute = express.Router();

initialRoute.get("/genirics", initialController.saveAllGeniric);

initialRoute.post("/medicins", initialController.saveAllGeniric);


export {initialRoute};