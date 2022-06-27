import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { User } from "../model/User";
import { userService } from "../service/user.service";
import respFormat from "../utils/response/respFormat";

class UserController {
  async getAll(req: Request, resp: Response) {
    try {
      const user = await userService.getAll();
      if (user) {
        resp.status(200);
        resp.send(respFormat(user, "user found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(user, "user not found"));
      }
    } catch (error) {
      apiWriteLog.error("user getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "user not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const user = await userService.getById(id);
      if (user) {
        resp.status(200);
        resp.send(respFormat(user, "user found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(user, "user not found"));
      }
    } catch (error) {
      apiWriteLog.error("user getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "user not found"));
    }
  }

  async add(req: Request, resp: Response) {
    const { firstName, lastName } = req.body;

    try {
      const user = await userService.save({
        firstName,
        lastName,
      });

      resp.status(201);
      resp.send(respFormat(user, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("user Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " user Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const { id, firstName, lastName } = req.body;

    try {
      const intId = parseInt(id);

      const user: Partial<User> = {
        id: intId,
        firstName,
        lastName,
      };
      const update = await userService.update(user);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "user updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "user update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("user Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "user update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await userService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "user deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("user Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "user delete failed", false));
    }
  }
}

export const userController = new UserController();
