import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { News } from "../model/News";
import { Tag } from "../model/Tag";
import { esIsEmpty } from "../utils/esHelper";

class NewsService {
  private newsRepository: Repository<News> | null = null;

  private initRepository(): void {
    if (this.newsRepository === null) {
      this.newsRepository = AppDataSource.getRepository(News);
    }
  }

  async save(news: Partial<News>) {
    let saveNews: News | null = null;

    if(news){

      const nNews:News = new News();

      Object.assign(nNews, nNews);
      nNews.images = [];
      nNews.metaDatas = [];
      nNews.tags = [];
      
      const queryRunner =  AppDataSource.createQueryRunner();
      await queryRunner.connect();
      queryRunner.startTransaction();
      try {
        
        const images:ImageGallery[] = [];
        const metadatas:MetaDeta[] = [];
        const tags:Tag[] = [];

        news.images&&news.images.map((image)=>{
          if(image.id > 0){
            nNews.addImage(image);
          }else{
            images.push(queryRunner.manager.create(ImageGallery, image));
          }
        });

        const dbImages = await queryRunner.manager.save(images);
        nNews.addAllImage(dbImages);

        news.metaDatas&&news.metaDatas.map((meta)=>{
          if(meta.id > 0){
            nNews.addMetaData(meta);
          }else{
            metadatas.push(queryRunner.manager.create(MetaDeta, meta));
          }
        })

        const dbMetas = await queryRunner.manager.save(metadatas);
        nNews.addAllMeta(dbMetas);

        news.tags&&news.tags.map((tag)=>{
          if(tag.id > 0){
            nNews.addTag(tag);
          }else{
            tags.push(queryRunner.manager.create(Tag, tag));
          }
        })

        const dbTags = await queryRunner.manager.save(tags);
        nNews.addAllTag(dbTags);

        saveNews = await queryRunner.manager.save(nNews);

        await queryRunner.commitTransaction();
      } catch (error) {
        apiWriteLog.error(`News Save Error `, error);
        await queryRunner.rollbackTransaction();
      }finally{
        if(queryRunner.isReleased){
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

  async getAll(): Promise<News[] | null | undefined> {
    this.initRepository();
    try {
      const news = await this.newsRepository?.find();
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
