import express from "express";
import { newsController } from "../controller/news.controller";

const newsRoute = express.Router();

newsRoute.get("/", newsController.getAll);

newsRoute.get(`/:id`, newsController.getById);

newsRoute.get(`/alias/name?`, newsController.getByAliasName);

newsRoute.post("/", newsController.add);

newsRoute.put("/", newsController.update);

newsRoute.delete(`/:id`, newsController.delete);

export { newsRoute };
