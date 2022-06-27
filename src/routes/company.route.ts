import express from "express";
import { companyController } from "../controller/company.controller";

const companyRoute = express.Router();

companyRoute.get("/", companyController.getAll);

companyRoute.get(`/:id`, companyController.getById);

companyRoute.post("/", companyController.add);

companyRoute.put("/", companyController.update);

companyRoute.delete(`/`, companyController.delete);

export { companyRoute };
