import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { postService } from "../service/post.service";
import respFormat from "../utils/response/respFormat";

class PostController {
  
  async getAllByLang(req: Request, resp: Response) {
   

    try {
      const posts = await postService.getAllByLanguage(req.query);
      if (posts) {
        resp.status(200);
        resp.send(respFormat(posts, `${posts.length} post(s) found`, true));
      } else {
        resp.status(202);
        resp.send(respFormat(posts, "post not found"));
      }
    } catch (error) {
      apiWriteLog.error("post getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "post not found"));
    }

  }

  async getSiteMapItems(req: Request, resp: Response) {
    const { start = 0, end = -1 } = req.query;

    try {
      const posts = await postService.getSiteMapItems(start, end);
      if (posts) {
        resp.status(200);
        resp.send(respFormat(posts, "post found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(posts, "post not found"));
      }
    } catch (error) {
      apiWriteLog.error("post getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "post not found"));
    }
  }
  async getAll(req: Request, resp: Response) {
    const { start = -1, end = 100, order } = req.query;

    try {
      const post = await postService.getAll({ start, end, order });
      if (post) {
        resp.status(200);
        resp.send(respFormat(post, "post found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(post, "post not found"));
      }
    } catch (error) {
      apiWriteLog.error("post getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "post not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);

    try {
      const post = await postService.getById(id);
      if (post) {
        resp.status(200);
        resp.send(respFormat(post, "post found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(post, "post not found"));
      }
    } catch (error) {
      apiWriteLog.error("post getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "post not found"));
    }
  }

  async getByAliasName(req: Request, resp: Response) {
   
    const blog = await postService.getByAlias(req?.query?.alias);

    if (blog) {
      resp.status(200);
      resp.send(respFormat(blog, "Blog Found", true));
    } else {
      resp.status(202);
      resp.send(respFormat(blog, "Blog not Found by given alias name", true));
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const post = await postService.save(req.body);

      resp.status(201);
      resp.send(respFormat(post, " Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("post Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " post Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    try {
      const update = await postService.update(req.body);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "post updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "post update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("post Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "post update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await postService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "post deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("post Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "post delete failed", false));
    }
  }
}

export const postController = new PostController();
