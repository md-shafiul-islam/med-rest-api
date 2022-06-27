
import express from "express";
import { categoryController } from "../controller/category.controller";

const categoryRoute = express.Router();

categoryRoute.get("/", categoryController.getAll);

categoryRoute.get("/tree", categoryController.getCategoryTree);

categoryRoute.get(`/:id`, categoryController.getById);

categoryRoute.post("/", categoryController.add);

categoryRoute.put("/", categoryController.update);

categoryRoute.delete(`/:id`, categoryController.delete);

export { categoryRoute };
