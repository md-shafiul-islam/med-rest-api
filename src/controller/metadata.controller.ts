import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { MetaDeta } from "../model/MetaData";
import { metadataService } from "../service/metadata.service";
import respFormat from "../utils/response/respFormat";

class MetadatController {
  async getAll(req: Request, resp: Response) {
    try {
      const metadata = await metadataService.getAll();
      if (metadata) {
        resp.status(200);
        resp.send(respFormat(metadata, "metadata found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(metadata, "metadata not found"));
      }
    } catch (error) {
      apiWriteLog.error("metadata getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "metadata not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const metadata = await metadataService.getById(id);
      if (metadata) {
        resp.status(200);
        resp.send(respFormat(metadata, "metadata found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(metadata, "metadata not found"));
      }
    } catch (error) {
      apiWriteLog.error("metadata getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "metadata not found"));
    }
  }

  async add(req: Request, resp: Response) {
    const { name, content } = req.body;

    try {
      const metadata = await metadataService.save({
        name,
        content,
      });

      resp.status(201);
      resp.send(respFormat(metadata, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("metadata Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " metadata Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const { id, name, content } = req.body;

    try {
      const intId = parseInt(id);

      const metadata: Partial<MetaDeta> = {
        id: intId,
        name,
        content,
      };
      const update = await metadataService.update(metadata);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "metadata updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "metadata update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("metadata Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "metadata update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await metadataService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "metadata deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("metadata Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "metadata delete failed", false));
    }
  }
}

export const metadatController = new MetadatController();
