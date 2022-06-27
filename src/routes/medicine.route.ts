
import express from "express";
import { medicineController } from "../controller/medicine.controller";

const medicinesRoute = express.Router();

medicinesRoute.get("/", medicineController.getAll);

medicinesRoute.get(`/:id`, medicineController.getById);

medicinesRoute.post("/", medicineController.add);

medicinesRoute.put("/", medicineController.update);

medicinesRoute.delete(`/:id`, medicineController.delete);

export { medicinesRoute };
