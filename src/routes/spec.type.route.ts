import express from "express";
import { specificationTypeController } from "../controller/specificationtype.controller";

const specTypeRoute = express.Router();

specTypeRoute.get("/", specificationTypeController.getAll);

specTypeRoute.get(`/:id`, specificationTypeController.getById);

specTypeRoute.post("/", specificationTypeController.add);

specTypeRoute.put("/", specificationTypeController.update);

specTypeRoute.delete(`/:id`, specificationTypeController.delete);

export { specTypeRoute };
