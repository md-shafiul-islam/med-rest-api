import express from "express";
import { medicineController } from "../controller/medicine.controller";

const medicinesRoute = express.Router();

medicinesRoute.get("/", medicineController.getAll);
medicinesRoute.get("/sitemap/query/", medicineController.getSiteMapQuery);

medicinesRoute.get(`/:id`, medicineController.getById);

medicinesRoute.get(`/alias/:aliasName`, medicineController.getByAlias);

medicinesRoute.get(`/search/items`, medicineController.getAllForSearch);

medicinesRoute.get(`/generic/:generic`, medicineController.getAllGeneric);

medicinesRoute.get(`/medicine/:name`, medicineController.getAllName);

medicinesRoute.get(`/count/all`, medicineController.getAllMedicinesCount);

medicinesRoute.get(`/query/:name`, medicineController.getAllByQueryName);

medicinesRoute.get(
  `/comb-query/:name`,
  medicineController.getAllByCommboQueryName
);

medicinesRoute.post("/", medicineController.add);

medicinesRoute.put("/", medicineController.update);

medicinesRoute.delete(`/:id`, medicineController.delete);

export { medicinesRoute };
