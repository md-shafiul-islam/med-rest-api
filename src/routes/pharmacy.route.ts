import express from "express";
import { pharmacyController } from "../controller/pharmacy.controller";

const pharmacyRoute = express.Router();

pharmacyRoute.get("/", pharmacyController.getAll);

pharmacyRoute.get("/query", pharmacyController.getByQuery);

pharmacyRoute.get(`/:id`, pharmacyController.getById);

pharmacyRoute.post("/", pharmacyController.add);

pharmacyRoute.put("/", pharmacyController.update);

pharmacyRoute.delete(`/:id`, pharmacyController.delete);

export { pharmacyRoute };
