import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Brand } from "../model/Brand";
import { SpecificationType } from "../model/SpecificationType";
import { esIsEmpty } from "../utils/esHelper";

class SpecificationTypeService {
  private specificationTypeRepository: Repository<SpecificationType> | null = null;

  private initRepository(): void {
    if (this.specificationTypeRepository === null) {
      this.specificationTypeRepository = AppDataSource.getRepository(SpecificationType);
    }
  }

  async save(specificationType: Partial<SpecificationType>) {
    this.initRepository();
    if (specificationType) {
      try {
        const resp = await this.specificationTypeRepository?.save(specificationType);

        return resp;
      } catch (error) {
        apiWriteLog.error("specificationType Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<SpecificationType | null | undefined> {
    this.initRepository();
    try {
      const specificationType = await this.specificationTypeRepository?.findOne({ where: { id: id } });
      return specificationType;
    } catch (err) {
      apiWriteLog.error("Error getspecificationTypeByID ", err);
      return null;
    }
  }

  async getAll(): Promise<SpecificationType[] | null | undefined> {
    this.initRepository();
    try {
      const specificationType = await this.specificationTypeRepository?.find();
      return specificationType;
    } catch (err) {
      apiWriteLog.error(`Error All specificationType `, err);
      return null;
    }
  }

  async update(specificationType: Partial<SpecificationType>):Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(specificationType)) {
      try {
        const updatespecificationType = await this.specificationTypeRepository?.update(
          { id: specificationType.id },
          specificationType
        );

        return updatespecificationType;
      } catch (error) {
        apiWriteLog.error(`Update specificationType Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const specificationTypes = await this.specificationTypeRepository?.delete({ id: id });
      return specificationTypes;
    } catch (err) {
      apiWriteLog.error("Error All specificationType ", err);
      return null;
    }
  }
}

export const specificationTypeService = new SpecificationTypeService();
