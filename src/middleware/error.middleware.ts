import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/HttpException";
import log from "../logger";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 5000;
    const message: string = error.message || "Something went wrong";

    log.error(
      `[${req.method}]${req.path} >> Status Code :: ${status}, Message:: ${message}`
    );
       

  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

