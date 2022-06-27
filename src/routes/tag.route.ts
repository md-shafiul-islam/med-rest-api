import express from "express";
import { tagController } from "../controller/tag.controller";

const tagRoute = express.Router();

tagRoute.get("/", tagController.getAll);

tagRoute.get(`/:id`, tagController.getById);

tagRoute.post("/", tagController.add);

tagRoute.put("/", tagController.update);

tagRoute.delete(`/:id`, tagController.delete);


export { tagRoute };
