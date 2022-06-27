import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { SpecKey } from "../model/SpecKey";
import { esIsEmpty } from "../utils/esHelper";

class SpecKeyService {
  private specKeyRepository: Repository<SpecKey> | null = null;

  private initRepository(): void {
    if (this.specKeyRepository === null) {
      this.specKeyRepository = AppDataSource.getRepository(SpecKey);
    }
  }

  async save(specKey: Partial<SpecKey>) {
    this.initRepository();
    if (specKey) {
      try {
        const resp = await this.specKeyRepository?.save(specKey);

        return resp;
      } catch (error) {
        apiWriteLog.error("specKey Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<SpecKey | null | undefined> {
    this.initRepository();
    try {
      const specKey = await this.specKeyRepository?.findOne({
        where: { id: id },
      });
      return specKey;
    } catch (err) {
      apiWriteLog.error("Error getspecKeyByID ", err);
      return null;
    }
  }

  async getAll(): Promise<SpecKey[] | null | undefined> {
    this.initRepository();
    try {
      const specKey = await this.specKeyRepository?.find();
      return specKey;
    } catch (err) {
      apiWriteLog.error(`Error All specKey `, err);
      return null;
    }
  }

  async update(
    specKey: Partial<SpecKey>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(specKey)) {
      try {
        const updatespecKey = await this.specKeyRepository?.update(
          { id: specKey.id },
          specKey
        );

        return updatespecKey;
      } catch (error) {
        apiWriteLog.error(`Update specKey Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const specKeys = await this.specKeyRepository?.delete({ id: id });
      return specKeys;
    } catch (err) {
      apiWriteLog.error("Error All specKey ", err);
      return null;
    }
  }
}

export const specKeyService = new SpecKeyService();
