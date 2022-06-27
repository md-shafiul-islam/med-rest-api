import express from "express";
import { specificationKeyController } from "../controller/specificationkey.controller";

const specKeyRoute = express.Router();

specKeyRoute.get("/", specificationKeyController.getAll);

specKeyRoute.get(`/:id`, specificationKeyController.getById);

specKeyRoute.post("/", specificationKeyController.add);

specKeyRoute.put("/", specificationKeyController.update);

specKeyRoute.delete(`/:id`, specificationKeyController.delete);

export { specKeyRoute };
