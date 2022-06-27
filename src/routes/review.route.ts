import express from "express";
import { reviewController } from "../controller/review.controller";

const reviewRoute = express.Router();

reviewRoute.get("/", reviewController.getAll);

reviewRoute.get(`/:id`, reviewController.getById);

reviewRoute.post("/", reviewController.add);

reviewRoute.put("/", reviewController.update);

reviewRoute.delete(`/:id`, reviewController.delete);

export { reviewRoute };
