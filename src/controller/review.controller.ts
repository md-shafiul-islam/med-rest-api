import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { reviewService } from "../service/review.service";
import respFormat from "../utils/response/respFormat";

class ReviewController {
  async getAll(req: Request, resp: Response) {
    try {
      const review = await reviewService.getAll();
      if (review) {
        resp.status(200);
        resp.send(respFormat(review, "review found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(review, "review not found"));
      }
    } catch (error) {
      apiWriteLog.error("review getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "review not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const review = await reviewService.getById(id);
      if (review) {
        resp.status(200);
        resp.send(respFormat(review, "review found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(review, "review not found"));
      }
    } catch (error) {
      apiWriteLog.error("review getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "review not found"));
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const review = await reviewService.save(req.body);

      resp.status(201);
      resp.send(respFormat(review, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("review Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " review Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    try {
      const update = await reviewService.update(req.body);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "review updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "review update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("review Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "review update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await reviewService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "review deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("review Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "review delete failed", false));
    }
  }
}

export const reviewController = new ReviewController();
