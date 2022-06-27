import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { ratingKeyServices } from "../service/rating.key.service";
import { ratingService } from "../service/rating.service";
import respFormat from "../utils/response/respFormat";

class RatingController {
  async getAll(req: Request, resp: Response) {
    try {
      const rating = await ratingService.getAll();
      if (rating) {
        resp.status(200);
        resp.send(respFormat(rating, "rating found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(rating, "rating not found"));
      }
    } catch (error) {
      apiWriteLog.error("rating getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const rating = await ratingService.getById(id);
      if (rating) {
        resp.status(200);
        resp.send(respFormat(rating, "rating found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(rating, "rating not found"));
      }
    } catch (error) {
      apiWriteLog.error("rating getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating not found"));
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const rating = await ratingService.save(req.body);

      resp.status(201);
      resp.send(respFormat(rating, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("rating Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " rating Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    try {
      const update = await ratingService.update(req.body);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "rating updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "rating update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("rating Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await ratingService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "rating deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("rating Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }

  async deleteRatingKey(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      let intId = Number(id);
      if (intId > 0) {
        const ratingKey = await ratingKeyServices.delete(intId);
        resp.status(202);
        resp.send(respFormat(ratingKey, "rating key deleted", true));
      }
    } catch (error) {
      apiWriteLog.error("rating key Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }

  async updateRatingKey(req: Request, resp: Response) {
    try {
      const ratingKey = await ratingKeyServices.update(req.body);
      resp.status(202);
      resp.send(respFormat(ratingKey, "rating key deleted", true));
    } catch (error) {
      apiWriteLog.error("rating key Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }

  async addRatingKey(req: Request, resp: Response) {
    try {
      const ratingKey = await ratingKeyServices.save(req.body);
      resp.status(202);
      resp.send(respFormat(ratingKey, "rating key deleted", true));
    } catch (error) {
      apiWriteLog.error("rating key Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }

  async getAllRatingKey(req: Request, resp: Response) {
    try {
      const ratingKeys = await ratingKeyServices.getAll();
      resp.status(202);
      resp.send(respFormat(ratingKeys, "rating key deleted", true));
    } catch (error) {
      apiWriteLog.error("rating key Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }

  async getRatingKey(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      const iId = Number(id);

      const ratingKey = await ratingKeyServices.getById(iId);
      resp.status(202);
      resp.send(respFormat(ratingKey, "rating key deleted", true));
    } catch (error) {
      apiWriteLog.error("rating key Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "rating delete failed", false));
    }
  }
}

export const ratingController = new RatingController();
