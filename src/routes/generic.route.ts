import express from "express";
import { genericController } from "../controller/generic.controller";

const genericRoute = express.Router();

genericRoute.get("/", genericController.getAll);

genericRoute.get(`/:id`, genericController.getById);

genericRoute.get(`/alias/:aliasName`, genericController.getByAliasName);

genericRoute.get(`/query/:name`, genericController.getByQueryName);

genericRoute.post("/", genericController.add);

genericRoute.put("/", genericController.update);

genericRoute.delete(`/:id`, genericController.delete);

export { genericRoute };
