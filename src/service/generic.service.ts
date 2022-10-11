import { ParsedQs } from "qs";
import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Generic } from "../model/Generic";
import { MetaDeta } from "../model/MetaData";
import { esIsEmpty } from "../utils/esHelper";

class GenericService {
  private genericRepository: Repository<Generic> | null = null;

  private initRepository(): void {
    if (this.genericRepository === null) {
      this.genericRepository = AppDataSource.getRepository(Generic);
    }
  }

  async getCount(query: any) {
    try {
      this.initRepository();
      const count = await this.genericRepository?.count({});
      console.log("Generic Services Count ", count);
      return count;
    } catch (error) {
      console.log("Generice Count Error ", error);
      apiWriteLog.error("Generic Count Failed ", error);
      return 0;
    }
  }

  async getSiteMapItems(start: number, size: number) {
    try {
      if (size > 0) {
        const generics = await AppDataSource.createQueryBuilder(
          Generic,
          "generic"
        )
          .select(["generic.updateDate", "generic.aliasName"])
          .offset(start)
          .limit(size)
          .getMany();
        return generics;
      } else {
        const generics = await AppDataSource.createQueryBuilder(
          Generic,
          "generic"
        )
          .select(["generic.updateDate", "generic.aliasName"])
          .getMany();
        return generics;
      }
    } catch (error) {
      apiWriteLog.error("Service Generic Query name not found ", error);
      return null;
    }
  }

  async getGenericByQueryName(name: string, limit: number | any = 50) {
    try {
      if (!esIsEmpty(name)) {
        if (name.length === 1) {
          name = `${name}%`;
        } else {
          name = `%${name}%`;
        }
      }
      apiWriteLog.info("Generic Query Name ", name);
      const generics = await AppDataSource.createQueryBuilder(
        Generic,
        "generic"
      )
        .where("generic.name LIKE :name", { name: name })
        .leftJoin("generic.medicines", "medicines")
        .loadRelationCountAndMap("generic.medicineSize", "generic.medicines")
        .select(["generic.key", "generic.name", "generic.aliasName"])
        .orderBy("generic.name", "ASC")
        .limit(limit)
        .getMany();
      return generics;
    } catch (error) {
      apiWriteLog.error("Service Generic Query name not found ", error);
      return null;
    }
  }

  async getGenericByAliasName(
    name: string | any
  ): Promise<Generic | null | undefined> {
    try {
      const generic = await AppDataSource.createQueryBuilder(Generic, "generic")
        .where("generic.aliasName= :aliasName", { aliasName: name })
        .leftJoinAndSelect("generic.medicines", "medicine")
        .leftJoinAndSelect("medicine.company", "company")
        .getOne();

      return generic;
    } catch (error) {
      apiWriteLog.error("Service Generic not found ", error);
      return null;
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
      const generic = await this.genericRepository?.findOne({
        where: { id: id },
      });
      return generic;
    } catch (err) {
      apiWriteLog.error("Error getspecificationByID ", err);
      return null;
    }
  }

  async getAll(
    offset: number,
    limit: number
  ): Promise<Generic[] | null | undefined> {
    try {
      if (limit > 0) {
        const generics = await AppDataSource.createQueryBuilder(
          Generic,
          "generic"
        )
          .leftJoin("generic.medicines", "medicines")
          .loadRelationCountAndMap("generic.medicineSize", "generic.medicines")
          .select(["generic.key", "generic.name", "generic.aliasName"])
          .offset(offset)
          .limit(limit)
          .getMany();

        return generics;
      } else {
        const generics = await AppDataSource.createQueryBuilder(
          Generic,
          "generic"
        )
          .leftJoin("generic.medicines", "medicines")
          .loadRelationCountAndMap("generic.medicineSize", "generic.medicines")
          .select(["generic.key", "generic.name", "generic.aliasName"])
          .getMany();
        return generics;
      }
    } catch (err) {
      apiWriteLog.error(`Services Error All generics `, err);
      return null;
    }
  }

  async update(
    generic: Partial<Generic>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();

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
      apiWriteLog.error("Services Error Error All Generic ", err);
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
      apiWriteLog.error("Generic using Meta Save Error ", error);
      await queryRunner.rollbackTransaction();
    } finally {
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

      //Save New Metatdata
      const queryGenerics: Generic[] = [];
      apiWriteLog.info(`Generic Save Befor loop ${generics.length} `);
      generics.forEach((item, idx) => {
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
        metaDatas.push(insMetaData);
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
      apiWriteLog.error("Generic using Meta Save Error ", error);
      await queryRunner.rollbackTransaction();
    } finally {
      if (queryRunner.isReleased) {
        await queryRunner.release();
      }
    }

    return saveGenerics;
  }
}

export const genericService = new GenericService();
