import express from "express";
import { ratingController } from "../controller/rating.controller";

const ratingRoute = express.Router();

ratingRoute.get("/", ratingController.getAll);

ratingRoute.get(`/:id`, ratingController.getById);

ratingRoute.post("/", ratingController.add);

ratingRoute.put("/", ratingController.update);

ratingRoute.delete(`/:id`, ratingController.delete);

ratingRoute.get("/rtaing-keys", ratingController.getAllRatingKey);
ratingRoute.get("/rtaing-keys/:id", ratingController.getAllRatingKey);
ratingRoute.post("/rtaing-keys", ratingController.addRatingKey);
ratingRoute.put("/rtaing-keys", ratingController.updateRatingKey);
ratingRoute.delete("/rtaing-keys/:id", ratingController.deleteRatingKey);

export { ratingRoute };
