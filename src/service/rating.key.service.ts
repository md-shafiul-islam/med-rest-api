import { Repository } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { RateKey } from "../model/RateKey";

class RatingKeyService {
  private ratingKeyRepository: Repository<RateKey> | null;

  private initRepository() {
    this.ratingKeyRepository = AppDataSource.getRepository(RateKey);
  }

  async getById(id: number) {
    this.initRepository();

    try {
      const ratingKey = await this.ratingKeyRepository?.findOne({
        where: { id },
      });
      return ratingKey;
    } catch (error) {
      apiWriteLog.error("Rating Key Error, ", error);
    }
    return null;
  }

  async getAll() {
    this.initRepository();

    try {
      const ratingKeys = await this.ratingKeyRepository?.find();
      return ratingKeys;
    } catch (error) {
      apiWriteLog.error("Rating All Key Error, ", error);
    }
    return null;
  }

  async save(ratingKey: RateKey) {
    this.initRepository();

    try {
      const ratingKeys = await this.ratingKeyRepository?.save(ratingKey);
      return ratingKeys;
    } catch (error) {
      apiWriteLog.error("Rating Key Save Error, ", error);
    }
    return null;
  }

  async update(rKey: RateKey) {
    try {
      if (rKey) {
        const ratingKey = await this.ratingKeyRepository?.update(
          { id: rKey.id },
          rKey
        );
        return ratingKey;
      }
    } catch (error) {
      apiWriteLog.error("Rating Key Update Error, ", error);
    }
    return null;
  }

  async delete(id: number) {
    try {
        if (id > 0 ) {
          const ratingKey = await this.ratingKeyRepository?.delete({id:id});
          return ratingKey;
        }
      } catch (error) {
        apiWriteLog.error("Rating Key Update Error, ", error);
      }
      return null;
  }
}

export const ratingKeyServices = new RatingKeyService();
