import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Generic } from "../model/Generic";
import { genericService } from "../service/generic.service";
import respFormat from "../utils/response/respFormat";

class GenericController {
  async getByAliasName(req: Request, resp: Response) {
    try {
      if (req.params) {
        const aliasName =
          req.params.aliasName !== undefined ? req.params.aliasName : "";
        const generic = await genericService.getGenericByAliasName(aliasName);

        if (generic) {
          resp.status(200);
          resp.send(respFormat(generic, `Generic found`, true));
        } else {
          resp.status(202);
          resp.send(respFormat(null, "generic not found"));
        }
      }
    } catch (error) {
      apiWriteLog.error("generic by alias Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic not found"));
    }
  }

  async getAll(req: Request, resp: Response) {
    try {
      apiWriteLog.info("Geting All Generic", null);
      const generics = await genericService.getAll();
      if (generics) {
        resp.status(200);
        resp.send(
          respFormat(generics, `${generics?.length} generic (s) found`, true)
        );
      } else {
        resp.status(202);
        resp.send(respFormat(generics, `generic not found`));
      }
    } catch (error) {
      apiWriteLog.error("generic getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const generic = await genericService.getById(id);
      if (generic) {
        resp.status(200);
        resp.send(respFormat(generic, "generic found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(generic, "generic not found"));
      }
    } catch (error) {
      apiWriteLog.error("generic getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic not found"));
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const generic = await genericService.save(req.body);
      resp.status(201);
      resp.send(respFormat(generic, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("generic Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " generic Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    try {
      const update = await genericService.update(req.body);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "generic updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "generic update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("generic Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await genericService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "generic deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("generic Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic delete failed", false));
    }
  }
}

export const genericController = new GenericController();
