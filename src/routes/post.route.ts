import express from "express";
import { postController } from "../controller/post.controller";

const postRoute = express.Router();

postRoute.get("/", postController.getAll);

postRoute.get(`/:id`, postController.getById);

postRoute.post("/", postController.add);

postRoute.put("/", postController.update);

postRoute.delete(`/:id`, postController.delete);

export { postRoute };
