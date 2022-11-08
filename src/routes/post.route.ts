import express from "express";
import { postController } from "../controller/post.controller";

const postRoute = express.Router();

postRoute.get("/", postController.getAll);

postRoute.get("/lang/", postController.getAllByLang);

postRoute.get("/sitemap/query/", postController.getSiteMapItems);

postRoute.get(`/:id`, postController.getById);

postRoute.get(`/alias/name`, postController.getByAliasName);

postRoute.post("/", postController.add);

postRoute.put("/", postController.update);

postRoute.delete(`/:id`, postController.delete);

export { postRoute };
