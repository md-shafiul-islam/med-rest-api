import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Rating } from "../model/Rating";
import { RatingItem } from "../model/RatingItem";
import { esIsEmpty } from "../utils/esHelper";

class RatingService {
  private ratingRepository: Repository<Rating> | null = null;
  private ratingItemRepository: Repository<RatingItem> | null = null;

  private initRepository(): void {
    if (this.ratingRepository === null) {
      this.ratingRepository = AppDataSource.getRepository(Rating);
    }

    if (this.ratingItemRepository === null) {
      this.ratingItemRepository = AppDataSource.getRepository(RatingItem);
    }
  }

  async save(rating: Partial<Rating>) {
    this.initRepository();
    if (rating) {
      try {
        const resp = await this.ratingRepository?.save(rating);

        return resp;
      } catch (error) {
        apiWriteLog.error("rating Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<Rating | null | undefined> {
    this.initRepository();
    try {
      const rating = await this.ratingRepository?.findOne({ where: { id } });
      return rating;
    } catch (err) {
      apiWriteLog.error("Error getratingByID ", err);
      return null;
    }
  }

  async getAll(): Promise<Rating[] | null | undefined> {
    this.initRepository();
    try {
      const rating = await this.ratingRepository?.find();
      return rating;
    } catch (err) {
      apiWriteLog.error(`Error All rating `, err);
      return null;
    }
  }

  async update(
    rating: Partial<Rating>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(rating)) {
      try {
        const updaterating = await this.ratingRepository?.update(
          { id: rating.id },
          rating
        );

        return updaterating;
      } catch (error) {
        apiWriteLog.error(`Update rating Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const ratings = await this.ratingRepository?.delete({ id: id });
      return ratings;
    } catch (err) {
      apiWriteLog.error("Error All rating ", err);
      return null;
    }
  }

  async addRatingByProduct(rating: Rating) {
    let saveRating: Rating | null | undefined = null;
    if (rating) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const nRating = new Rating();
        Object.assign(nRating, rating);

        saveRating = queryRunner.manager.create(Rating, nRating);

        saveRating = await queryRunner.manager.save(saveRating);

        let ratingItems: RatingItem[] = [];

        rating.ratingItems?.map((ratingItem) => {
          if (saveRating !== null && saveRating !== undefined) {
            ratingItem.rating = saveRating;
          }
          ratingItems.push(queryRunner.manager.create(RatingItem, ratingItem));
        });
        ratingItems = await queryRunner.manager.save(ratingItems);
        saveRating.ratingItems = ratingItems;
        await queryRunner.commitTransaction();
      } catch (error) {
        apiWriteLog.error("Add Product Review Error ", error);
        await queryRunner.rollbackTransaction();
      } finally {
        if (queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    }
    return saveRating;
  }

  
}

export const ratingService = new RatingService();
