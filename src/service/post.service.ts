import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { Post } from "../model/Post";
import { esIsEmpty, helperIsNumber } from "../utils/esHelper";
import { categoryService } from "./category.service";
import { companyService } from "./company.service";
import { userService } from "./user.service";

class PostService {
  private postRepository: Repository<Post> | null = null;

  private initRepository(): void {
    if (this.postRepository === null) {
      this.postRepository = AppDataSource.getRepository(Post);
    }
  }

  async getSiteMapItems(start: any, end: any) {
    try {
      let offset = Number(start);
      offset = helperIsNumber(offset) ? offset : 0;
      let size = Number(end);
      size = helperIsNumber(size) ? size : -1;
      if (size > 0) {
        const blogs = await AppDataSource.createQueryBuilder(Post, "post")
          .select(["post.aliasName", "post.updateDate"])
          .offset(offset)
          .limit(size)
          .getMany();
        return blogs;
      } else {
        const blogs = await AppDataSource.createQueryBuilder(Post, "post")
          .select(["post.aliasName", "post.updateDate"])
          .getMany();
        return blogs;
      }
    } catch (error) {
      apiWriteLog.error("Error getpostByAlias ", error);
      return null;
    }
  }

  async save(post: any) {
    let resp: Post | null = null;
    if (post) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      await queryRunner.startTransaction();
      try {
        const metaDetas: MetaDeta[] = [];
        const images: ImageGallery[] = [];

        const {
          aliasName,
          title,
          content,
          company,
          category,
          shortContent,
          user,
        } = post;

        const pUser = await userService.getUserByPublicId(user?.id);
        const cat = await categoryService.getCategoryById(category);
        const comp = await companyService.getCompanyById(company);

        const nPost: Post = new Post();

        if (cat !== null && cat !== undefined) {
          nPost.category = cat;
        }

        if (comp !== null && comp !== undefined) {
          nPost.company = comp;
        }

        if (pUser != null) {
          nPost.author = pUser;
        }

        nPost.aliasName = aliasName;
        nPost.content = content;
        nPost.shortContent = shortContent;
        nPost.title = title;

        nPost.images = [];
        nPost.metaDatas = [];

        post.metaDatas &&
          post.metaDatas.forEach((metaData: MetaDeta) => {
            if (metaData.id > 0) {
              nPost.addMeta(metaData);
            } else {
              metaDetas.push(queryRunner.manager.create(MetaDeta, metaData));
            }
          });

        const dbMetas = await queryRunner.manager.save(metaDetas);
        nPost.addAllMetaData(dbMetas);

        post.images &&
          post.images.forEach((image: ImageGallery) => {
            if (image.id > 0) {
              nPost.addImage(image);
            } else {
              images.push(queryRunner.manager.create(ImageGallery, image));
            }
          });
        const dbImages = await queryRunner.manager.save(ImageGallery, images);
        nPost.addAllImage(dbImages);

        const initPost = queryRunner.manager.create(Post, nPost);
        resp = await queryRunner.manager.save(initPost);

        await queryRunner.commitTransaction();
      } catch (error) {
        queryRunner.rollbackTransaction();
        apiWriteLog.error("Post Save error ", error);
      } finally {
        if (queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    }
    return resp;
  }

  async getById(id: number): Promise<Post | null | undefined> {
    this.initRepository();
    try {
      const post = await this.postRepository?.findOne({ where: { id: id } });
      return post;
    } catch (err) {
      apiWriteLog.error("Error getpostByID ", err);
      return null;
    }
  }

  async getByAlias(alias: any) {
    try {
      const blog = await AppDataSource.createQueryBuilder(Post, "post")
        .leftJoinAndSelect("post.images", "images")
        .leftJoinAndSelect("post.metaDatas", "metaDatas")
        .leftJoinAndSelect("post.company", "company")
        .leftJoinAndSelect("post.category", "category")
        .leftJoinAndSelect("post.author", "author")
        .where({ aliasName: alias })
        .getOne();
      return blog;
    } catch (error) {
      apiWriteLog.error("Error getpostByAlias ", error);
      return null;
    }
  }

  async getAll(query: any): Promise<Post[] | null | undefined> {
    this.initRepository();
    try {
      const { start, end, order } = query;
      let post: Post[] = [];
      const odr = order === "desc" ? "DESC" : "ASC";
      if (start >= 0) {
        post = await AppDataSource.createQueryBuilder(Post, "post")
          .leftJoinAndSelect("post.images", "images")
          .orderBy(`post.createdDate`, odr)
          .offset(start)
          .limit(end)
          .getMany();
      } else {
        post = await AppDataSource.createQueryBuilder(Post, "post")
          .leftJoinAndSelect("post.images", "images")
          .orderBy(`post.createdDate`, odr)
          .getMany();
      }

      return post;
    } catch (err) {
      apiWriteLog.error(`Error All post `, err);
      return null;
    }
  }

  async update(post: Partial<Post>): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(post)) {
      try {
        const updatepost = await this.postRepository?.update(
          { id: post.id },
          post
        );

        return updatepost;
      } catch (error) {
        apiWriteLog.error(`Update post Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const posts = await this.postRepository?.delete({ id: id });
      return posts;
    } catch (err) {
      apiWriteLog.error("Error All post ", err);
      return null;
    }
  }
}

export const postService = new PostService();
