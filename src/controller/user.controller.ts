import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { User } from "../model/User";
import { jwtAuthServices } from "../service/jwtAuthServices.services";
import { userService } from "../service/user.service";
import respFormat from "../utils/response/respFormat";

class UserController {
  async getAll(req: Request, resp: Response) {
    try {
      const user = await userService.getAll();
      if (user) {
        resp.status(200);
        resp.send(respFormat(user, "User (s) found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(user, "User (s) not found"));
      }
    } catch (error) {
      apiWriteLog.error("user getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "user not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    console.log("Get User Header ");

    const id = req?.params?.id;
    try {
      const vToken = jwtAuthServices.verifyToken(req.headers.authorization);
      
      const user = await userService.getById(id);
      if (user) {
        resp.status(200);
        resp.send(respFormat(user, "User found By given ID", true));
      } else {
        resp.status(202);
        resp.send(respFormat(user, "user not found By given ID"));
      }
    } catch (error) {
      apiWriteLog.error("user getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "user not found"));
    }
  }

  async getUserLogin(req: Request, resp: Response) {
    console.log("Request Query ", req.body);

    try {
      let user = null;
      const respUser = await userService.getUserLogin(req.body);
      console.log("user found ", respUser);
      if (respUser) {
        user = respUser;
        resp.status(200);
        resp.send(respFormat(user, `User login Success`, true));
      } else {
        resp.status(200);
        resp.send(
          respFormat(
            user,
            `User login faild, Username or password invalid`,
            false
          )
        );
      }
    } catch (error) {
      resp.status(200);
      resp.send(
        respFormat(
          null,
          `User login faild, Username or password invalid`,
          false
        )
      );
    }
  }

  async getUserLoginNext(req: Request, resp: Response) {
    console.log("Request Query ", req.body);

    try {
      let user = null;
      const respUser = await userService.getNextUserLogin(req.body);
      console.log("user found ", respUser);
      if (respUser) {
        user = respUser;
        resp.status(200);
        resp.send(respFormat(user, `User login Success`, true));
      } else {
        resp.status(200);
        resp.send(
          respFormat(
            user,
            `User login faild, Username or password invalid`,
            false
          )
        );
      }
    } catch (error) {
      resp.status(200);
      resp.send(
        respFormat(
          null,
          `User login faild, Username or password invalid`,
          false
        )
      );
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const userResp = await userService.save(req.body);

      resp.status(201);
      resp.send(respFormat(userResp, " Save Or Added", true));
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
