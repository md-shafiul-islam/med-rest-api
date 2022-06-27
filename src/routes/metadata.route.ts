import express from "express";
import { metadatController } from "../controller/metadata.controller";

const metaRoute = express.Router();

metaRoute.get("/", metadatController.getAll);

metaRoute.get(`/:id`, metadatController.getById);

metaRoute.post("/", metadatController.add);

metaRoute.put("/", metadatController.update);

metaRoute.delete(`/:id`, metadatController.delete);

export { metaRoute };
