import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { News } from "../model/News";
import { esIsEmpty } from "../utils/esHelper";
import { categoryService } from "./category.service";
import { companyService } from "./company.service";
import { userService } from "./user.service";

class NewsService {
  private newsRepository: Repository<News> | null = null;

  private initRepository(): void {
    if (this.newsRepository === null) {
      this.newsRepository = AppDataSource.getRepository(News);
    }
  }

  async getAllByLanguage(query: any) {
    try {
      const { start, size, order, type } = query;
      const odr = order === "asc" ? "ASC" : "DESC";
      let news: News[] = [];
      if (start >= 0) {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .leftJoinAndSelect("news.images", "images")
          .where({ lang: type })
          .orderBy("news.crateDate", odr)
          .take(size)
          .offset(start)
          .getMany();
      } else {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .leftJoinAndSelect("news.images", "images")
          .where({ lang: type })
          .orderBy("news.crateDate", odr)
          .getMany();
      }

      return news;
    } catch (err) {
      apiWriteLog.error(`Error All news `, err);
      return null;
    }
  }

  async getMapItems(offset: number, limit: number) {
    try {
      let news: News[] = [];
      if (limit > 0) {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .select(["news.newsAlias", "news.updateDate"])
          .limit(limit)
          .offset(offset)
          .getMany();
      } else {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .select(["news.newsAlias", "news.updateDate"])
          .getMany();
      }

      return news;
    } catch (err) {
      apiWriteLog.error(`Error All news `, err);
      return null;
    }
  }

  async save(news: any) {
    let saveNews: News | null = null;

    if (news) {
      const nNews: News = new News();

      const user = await userService.getUserByPublicId(news?.user?.id);

      const category = await categoryService.getCategoryById(news.category);
      const company = await companyService.getCompanyById(news.company);

      news.category = null;
      news.company = null;

      nNews.images = [];
      nNews.metaDatas = [];

      if (category !== null && category !== undefined) {
        nNews.category = category;
      }

      if (company !== null && company !== undefined) {
        nNews.company = company;
      }

      if (user !== undefined && user !== null) {
        nNews.user = user;
      }
      const { title, newsAlias, content, shortContent, lang } = news;
      nNews.content = content;
      nNews.shortContent = shortContent;
      nNews.newsAlias = newsAlias;
      nNews.title = title;
      nNews.lang = lang;
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      queryRunner.startTransaction();
      try {
        const images: ImageGallery[] = [];
        const metadatas: MetaDeta[] = [];

        news.images &&
          news.images.map((image: ImageGallery) => {
            if (image.id > 0) {
              nNews.addImage(image);
            } else {
              images.push(queryRunner.manager.create(ImageGallery, image));
            }
          });

        const dbImages = await queryRunner.manager.save(images);
        nNews.addAllImage(dbImages);

        news.metaDatas &&
          news.metaDatas.map((meta: MetaDeta) => {
            if (meta.id > 0) {
              nNews.addMetaData(meta);
            } else {
              metadatas.push(queryRunner.manager.create(MetaDeta, meta));
            }
          });

        const dbMetas = await queryRunner.manager.save(metadatas);
        nNews.addAllMeta(dbMetas);
        queryRunner.manager.create(News, nNews);
        saveNews = await queryRunner.manager.save(nNews);

        await queryRunner.commitTransaction();
      } catch (error) {
        apiWriteLog.error(`News Save Error `, error);
        await queryRunner.rollbackTransaction();
      } finally {
        if (queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    }

    return saveNews;
  }

  async getById(id: number): Promise<News | null | undefined> {
    this.initRepository();
    try {
      const news = await this.newsRepository?.findOne({ where: { id: id } });
      return news;
    } catch (err) {
      apiWriteLog.error("Error getNewsByID ", err);
      return null;
    }
  }

  async getByAlias(alias: any) {
    try {
      const news = await AppDataSource.createQueryBuilder(News, "news")
        .leftJoinAndSelect("news.images", "images")
        .leftJoinAndSelect("news.metaDatas", "metaDatas")
        .leftJoinAndSelect("news.company", "company")
        .leftJoinAndSelect("news.category", "category")
        .leftJoinAndSelect("news.user", "user")
        .where({ newsAlias: alias })
        .getOne();
      return news;
    } catch (err) {
      apiWriteLog.error("Error getNewsByAlias ", err);
      return null;
    }
  }

  async getAll(query: any): Promise<News[] | null | undefined> {
    try {
      const { start, size, order } = query;
      const odr = order === "desc" ? "DESC" : "ASC";
      let news: News[] = [];
      if (start >= 0) {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .leftJoinAndSelect("news.images", "images")
          .orderBy("news.crateDate", odr)
          .limit(size)
          .offset(start)
          .getMany();
      } else {
        news = await AppDataSource.createQueryBuilder(News, "news")
          .leftJoinAndSelect("news.images", "images")
          .orderBy("news.crateDate", odr)
          .getMany();
      }

      return news;
    } catch (err) {
      apiWriteLog.error(`Error All news `, err);
      return null;
    }
  }

  async update(news: Partial<News>): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(news)) {
      try {
        const updatenews = await this.newsRepository?.update(
          { id: news.id },
          news
        );

        return updatenews;
      } catch (error) {
        apiWriteLog.error(`Update news Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const newss = await this.newsRepository?.delete({ id: id });
      return newss;
    } catch (err) {
      apiWriteLog.error("Error All news ", err);
      return null;
    }
  }
}

export const newsService = new NewsService();
