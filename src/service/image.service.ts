import { Repository, TreeRepository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Category } from "../model/Category";
import { ImageGallery } from "../model/ImageGallery";

import { esIsEmpty } from "../utils/esHelper";

class ImageService {
  private imageRepository: Repository<ImageGallery> | null = null;

  private initRepository(): void {
    if (this.imageRepository === null) {
      this.imageRepository = AppDataSource.getRepository(ImageGallery);
    }
  }

  async save(imageGallery: ImageGallery) {
    this.initRepository();
    if (imageGallery) {
      try {
        //Upload Image & Save Image Url Tags
      } catch (error) {
        apiWriteLog.error("category Save Failed ");
      }
    }
    return null;
  }

  async getImageGalleryById(
    id: number
  ): Promise<ImageGallery | null | undefined> {
    this.initRepository();
    try {
      const image = await this.imageRepository?.findOne({
        where: { id: id },
      });
      return image;
    } catch (err) {
      apiWriteLog.error("Error Image Gallery ", err);
      return null;
    }
  }

  async getAllCategory(): Promise<ImageGallery[] | null | undefined> {
    this.initRepository();
    try {
      const images = await this.imageRepository?.find();
      return images;
    } catch (err) {
      apiWriteLog.error(`Error All Images `, err);
      return null;
    }
  }

  async updateImage(
    name: string,
    location: string,
    imageUrl: string,
    id: number,
    parent: ImageGallery
  ) {
    this.initRepository();
    try {
      const dbImage = await this.imageRepository?.findOneBy({ id });
      if (dbImage !== null && dbImage !== undefined) {
        apiWriteLog.info("Image Update ... ");
        // let name: string = "";
        // let description: string = "";
        if (!esIsEmpty(location)) {
          dbImage.location = location;
        }

        if (!esIsEmpty(name)) {
          dbImage.name = name;
        }

        if (!esIsEmpty(imageUrl)) {
          dbImage.imageUrl = imageUrl;
        }

        const updateImage = await this.imageRepository?.save(dbImage);
        apiWriteLog.info("Category Update Response ", updateImage);
        return updateImage;
      }
    } catch (error) {
      apiWriteLog.error(`Update category Error, `, error);
      return null;
    }
    return null;
  }
  async deleteCategory(id: number) {
    this.initRepository();
    try {
      const image = await this.imageRepository?.delete({ id: id });
      return image;
    } catch (err) {
      apiWriteLog.error("Error Delete category ", err);
      return null;
    }
  }
}

export const imageService = new ImageService();
