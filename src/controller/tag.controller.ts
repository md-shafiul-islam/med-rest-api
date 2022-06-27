import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Tag } from "../model/Tag";
import { tagService } from "../service/tag.service";
import respFormat from "../utils/response/respFormat";

class TagController {
  async getAll(req: Request, resp: Response) {
    try {
      const tags = await tagService.getAll();
      if (tags) {
        resp.status(200);
        resp.send(respFormat(tags, "tag found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(tags, "tag not found"));
      }
    } catch (error) {
      apiWriteLog.error("tag getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "tag not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const tag = await tagService.getById(id);
      if (tag) {
        resp.status(200);
        resp.send(respFormat(tag, "tag found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(tag, "tag not found"));
      }
    } catch (error) {
      apiWriteLog.error("tag getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "tag not found"));
    }
  }

  async add(req: Request, resp: Response) {
    const { name, value } = req.body;

    try {
      const tag = await tagService.save({
        name,
        value,
      });

      resp.status(201);
      resp.send(respFormat(tag, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("tag Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " tag Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const { id, value, name } = req.body;

    try {
      const intId = parseInt(id);

      const tag: Partial<Tag> = {
        id: intId,
        value,
        name,
      };
      const update = await tagService.update(tag);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "tag updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "tag update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("tag Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "tag update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await tagService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "tag deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("tag Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "tag delete failed", false));
    }
  }

  
}

export const tagController = new TagController();
