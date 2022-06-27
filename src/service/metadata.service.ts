import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { MetaDeta } from "../model/MetaData";
import { esIsEmpty } from "../utils/esHelper";

class MetadataService {
  private metadataRepository: Repository<MetaDeta> | null = null;

  private initRepository(): void {
    if (this.metadataRepository === null) {
      this.metadataRepository = AppDataSource.getRepository(MetaDeta);
    }
  }

  async save(metadata: Partial<MetaDeta>) {
    this.initRepository();
    if (metadata) {
      try {
        const resp = await this.metadataRepository?.save(metadata);

        return resp;
      } catch (error) {
        apiWriteLog.error("metadata Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<MetaDeta | null | undefined> {
    this.initRepository();
    try {
      const metadata = await this.metadataRepository?.findOne({ where: { id: id } });
      return metadata;
    } catch (err) {
      apiWriteLog.error("Error getmetadataByID ", err);
      return null;
    }
  }

  async getAll(): Promise<MetaDeta[] | null | undefined> {
    this.initRepository();
    try {
      const metadatas = await this.metadataRepository?.find();
      return metadatas;
    } catch (err) {
      apiWriteLog.error(`Error All metadata `, err);
      return null;
    }
  }

  async update(metadata: Partial<MetaDeta>): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(metadata)) {
      try {
        const updatemetadata = await this.metadataRepository?.update(
          { id: metadata.id },
          metadata
        );

        return updatemetadata;
      } catch (error) {
        apiWriteLog.error(`Update metadata Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const metadatas = await this.metadataRepository?.delete({ id: id });
      return metadatas;
    } catch (err) {
      apiWriteLog.error("Error All metadata ", err);
      return null;
    }
  }
}

export const metadataService = new MetadataService();
