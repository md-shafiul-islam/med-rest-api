import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Generic } from "../model/Generic";
import { MetaDeta } from "../model/MetaData";
import { Tag } from "../model/Tag";
import { esIsEmpty } from "../utils/esHelper";

class GenericService {
  private genericRepository: Repository<Generic> | null = null;

  private initRepository(): void {
    if (this.genericRepository === null) {
      this.genericRepository = AppDataSource.getRepository(Generic);
    }
  }

  async save(generic: Partial<Generic>) {
    this.initRepository();
    if (generic) {
      try {
        const resp = await this.genericRepository?.save(generic);
        return resp;
      } catch (error) {
        apiWriteLog.error("Generic Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<Generic | null | undefined> {
    this.initRepository();
    try {
      const specification = await this.genericRepository?.findOne({
        where: { id: id },
      });
      return specification;
    } catch (err) {
      apiWriteLog.error("Error getspecificationByID ", err);
      return null;
    }
  }

  async getAll(): Promise<Generic[] | null | undefined> {
    this.initRepository();
    try {
      const generics = await this.genericRepository
        ?.createQueryBuilder("generic")
        .leftJoin("generic.medicines", "medicines")
        .loadRelationCountAndMap("generic.medicineSize", "generic.medicines")
        .getMany();
      return generics;
    } catch (err) {
      apiWriteLog.error(`Error All specification `, err);
      return null;
    }
  }

  async update(
    specification: Partial<Generic>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(specification)) {
      try {
        const updatespecification = await this.genericRepository?.update(
          { id: specification.id },
          specification
        );

        return updatespecification;
      } catch (error) {
        apiWriteLog.error(`Update specification Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const specifications = await this.genericRepository?.delete({
        id: id,
      });
      return specifications;
    } catch (err) {
      apiWriteLog.error("Error All specification ", err);
      return null;
    }
  }

  async saveGenericUsingJson(generic: Generic) {
    let initGeneric: Generic = new Generic();

    const queryRunner = AppDataSource.createQueryRunner();
    queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const metaDatas: MetaDeta[] = [];
      const tags: Tag[] = [];
      //Save New Metatdata

      let tag = new Tag();
      tag.name = generic.name;
      tag.value = generic.aliasName;
      tag.generics = [generic];

      let initTag = queryRunner.manager.create(Tag, tag);
      initTag = await queryRunner.manager.save(Tag, initTag);
      generic.addTag(initTag);

      let metadata = new MetaDeta();
      metadata.name = "description";
      metadata.content = generic.indication;
      metadata.generics = [generic];
      const insMetaData = queryRunner.manager.create(MetaDeta, metadata);

      let metadata2 = new MetaDeta();
      metadata2.name = "keywords";
      metadata2.content = `${generic.name}`;
      metadata2.generics = [generic];
      const insMetaData2 = queryRunner.manager.create(MetaDeta, metadata2);

      metaDatas.push(insMetaData);
      metaDatas.push(insMetaData2);

      const initMetas = await queryRunner.manager.save(metaDatas);
      generic.addAllMetaData(initMetas);

      initGeneric = queryRunner.manager.create(Generic, generic);
      initGeneric = await queryRunner.manager.save(Generic, initGeneric);

      await queryRunner.commitTransaction();
    } catch (error) {
      apiWriteLog.error("Generic using Tag & Meta Save Error ", error);
      await queryRunner.rollbackTransaction();
    } finally {
      console.log("Query Runner ", queryRunner.isReleased);
      if (queryRunner.isReleased) {
        await queryRunner.release();
      }
    }

    return initGeneric;
  }

  async saveAllGenericUsingJson(generics: Generic[]) {
    let saveGenerics: Generic[] = [];

    const queryRunner = AppDataSource.createQueryRunner();
    queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const metaDatas: MetaDeta[] = [];
      const tags: Tag[] = [];
      //Save New Metatdata
      const queryGenerics: Generic[] = [];
      apiWriteLog.info(`Generic Save Befor loop ${generics.length} `);
      generics.forEach((item, idx) => {
        let tag = new Tag();
        tag.name = item.name;
        tag.value = item.aliasName;
        tag.generics = [item];

        let initTag = queryRunner.manager.create(Tag, tag);
        queryRunner.manager.save(initTag);
        item.addTag(initTag);

        let metadata = new MetaDeta();
        metadata.name = "description";
        metadata.content = item.indication;
        metadata.generics = [item];
        const insMetaData = queryRunner.manager.create(MetaDeta, metadata);

        let metadata2 = new MetaDeta();
        metadata2.name = "keywords";
        metadata2.content = `${item.name}`;
        metadata2.generics = [item];
        const insMetaData2 = queryRunner.manager.create(MetaDeta, metadata2);
        +metaDatas.push(insMetaData);
        metaDatas.push(insMetaData2);
        queryRunner.manager.save(MetaDeta, metaDatas);
        item.addAllMetaData(metaDatas);

        queryGenerics.push(queryRunner.manager.create(Generic, item));
        apiWriteLog.info(`Current Item ${idx} `);
      });

      apiWriteLog.info(`Generic Save Befor Size ${queryGenerics.length} `);

      saveGenerics = await queryRunner.manager.save(Generic, queryGenerics);
      apiWriteLog.info(`After Generic saveGenerics  ${saveGenerics.length} `);

      await queryRunner.commitTransaction();
    } catch (error) {
      apiWriteLog.error("Generic using Tag & Meta Save Error ", error);
      await queryRunner.rollbackTransaction();
    } finally {
      console.log("Query Runner ", queryRunner.isReleased);
      if (queryRunner.isReleased) {
        await queryRunner.release();
      }
    }

    return saveGenerics;
  }
}

export const genericService = new GenericService();
