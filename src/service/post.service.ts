import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { Post } from "../model/Post";
import { esIsEmpty } from "../utils/esHelper";

class PostService {
  private postRepository: Repository<Post> | null = null;

  private initRepository(): void {
    if (this.postRepository === null) {
      this.postRepository = AppDataSource.getRepository(Post);
    }
  }

  async save(post: Post) {
    let resp: Post | null = null;
    if (post) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      await queryRunner.startTransaction();
      try {
        const metaDetas: MetaDeta[] = [];
        const images: ImageGallery[] = [];

        const nPost: Post = new Post();
        Object.assign(nPost, post);
        nPost.images = [];
        nPost.metaDatas = [];

        post.metaDatas &&
          post.metaDatas.forEach(async (metaData, idx) => {
            if (metaData.id > 0) {
              nPost.addMeta(metaData);
            } else {
              metaDetas.push(queryRunner.manager.create(MetaDeta, metaData));
            }
          });

        const dbMetas = await queryRunner.manager.save(metaDetas);
        nPost.addAllMetaData(dbMetas);

        post.images &&
          post.images.forEach(async (image, idx) => {
            if (image.id > 0) {
              nPost.addImage(image);
            } else {
              images.push(queryRunner.manager.create(ImageGallery, image));
            }
          });
        const dbImages = await queryRunner.manager.save(ImageGallery, images);
        nPost.addAllImage(dbImages);

        apiWriteLog.info(`Post image Size ${nPost.images.length}`);
        apiWriteLog.info(`Post metaDatas Size ${nPost.metaDatas.length}`);

        const initPost = queryRunner.manager.create(Post, nPost);
        resp = await queryRunner.manager.save(initPost);

        await queryRunner.commitTransaction();
      } catch (error) {
        queryRunner.rollbackTransaction();
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

  async getAll(): Promise<Post[] | null | undefined> {
    this.initRepository();
    try {
      const post = await this.postRepository?.find();
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
