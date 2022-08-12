import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { genericService } from "../service/generic.service";
import respFormat from "../utils/response/respFormat";

class GenericController {
  
  async getByQueryName(req: Request, resp: Response) {
    try {
      if (req.params) {
        const name = req.params.name !== undefined ? req.params.name : "";
        const generics = await genericService.getGenericByQueryName(
          name,
          req.query.limit
        );

        if (generics) {
          resp.status(200);
          resp.send(
            respFormat(generics, `${generics?.length} Generic(s) found`, true)
          );
        } else {
          resp.status(202);
          resp.send(respFormat(null, "generic (s) not found by Query Name"));
        }
      }
    } catch (error) {
      apiWriteLog.error("generic by alias Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "generic not found"));
    }
  }
  async getByAliasName(req: Request, resp: Response) {
    try {
      if (req.query) {
        const generic = await genericService.getGenericByAliasName(
          req.query.name
        );

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
