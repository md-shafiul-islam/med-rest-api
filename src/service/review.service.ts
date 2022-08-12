import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Pharmacy } from "../model/Pharmacy";
import { Review } from "../model/Review";
import { esIsEmpty } from "../utils/esHelper";

class ReviewService {
  private reviewRepository: Repository<Review> | null = null;

  private initRepository(): void {
    if (this.reviewRepository === null) {
      this.reviewRepository = AppDataSource.getRepository(Review);
    }
  }

  async save(review: Partial<Review>) {
    this.initRepository();
    if (review) {
      try {
        const resp = await this.reviewRepository?.save(review);

        return resp;
      } catch (error) {
        apiWriteLog.error("review Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<Review | null | undefined> {
    this.initRepository();
    try {
      const review = await this.reviewRepository?.findOne({
        where: { id: id },
      });
      return review;
    } catch (err) {
      apiWriteLog.error("Error getreviewByID ", err);
      return null;
    }
  }

  async getAll(): Promise<Review[] | null | undefined> {
    this.initRepository();
    try {
      const review = await this.reviewRepository?.find();
      return review;
    } catch (err) {
      apiWriteLog.error(`Error All review `, err);
      return null;
    }
  }

  async update(
    review: Partial<Review>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(review)) {
      try {
        const updatereview = await this.reviewRepository?.update(
          { id: review.id },
          review
        );

        return updatereview;
      } catch (error) {
        apiWriteLog.error(`Update review Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const reviews = await this.reviewRepository?.delete({ id: id });
      return reviews;
    } catch (err) {
      apiWriteLog.error("Error All review ", err);
      return null;
    }
  }

  async getAllReviewsByPharmacy(id: number) {
    if (id > 0) {
      try {
        const reviews = await this.reviewRepository?.find({
          where: { pharmacy: { id: id } },
        });
        return reviews;
      } catch (err) {
        apiWriteLog.error("Error All review ", err);
        return null;
      }
    }
    return null;
  }

  async getAddReviewsByProduct(pharmacy:Pharmacy, content:string){
    this.initRepository();
    try {
      const review = new Review();
      review.pharmacy = pharmacy;
      review.content = content;
      // review.author get session -> user
      const saveReview = await this.reviewRepository?.save(review);
      return saveReview;
    } catch (err) {
      apiWriteLog.error("Save product review Error ", err);
      return null;
    }
  }
}

export const reviewService = new ReviewService();
