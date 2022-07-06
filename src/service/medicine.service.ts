import { Brackets, EntityManager, Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Comment } from "../model/Comment";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { Post } from "../model/Post";
import { Medicine } from "../model/Medicine";
import { Tag } from "../model/Tag";
import { User } from "../model/User";
import { esIsEmpty } from "../utils/esHelper";
import { genericService } from "./generic.service";
import { ParsedQs } from "qs";

class MedicineService {
  private medicineRepository: Repository<Medicine> | null = null;

  private initRepository(): void {
    if (this.medicineRepository === null) {
      this.medicineRepository = AppDataSource.getRepository(Medicine);
    }
  }

  async getAllByQueryComboName(name: string, limit: number | any = 50) {
    try {
      console.log("Services medicines By Query Combo ... ", name);
      apiWriteLog.info("Services Medicine Name Combo Query, ", name);

      if (!esIsEmpty(name)) {
        if (name.length === 1) {
          name = `${name}%`;
        } else {
          name = `%${name}%`;
        }
        console.log("Befor Query Name ", name);
        const medicines = await AppDataSource.createQueryBuilder(
          Medicine,
          "medicine"
        )
          .leftJoinAndSelect("medicine.generic", "generic")

          .where("medicine.name LIKE :name", { name })
          .orWhere("generic.name LIKE :name", { name })
          .select([
            "medicine.name",
            "medicine.aliasName",
            "medicine.strength",
            "medicine.form",
            "medicine.price",
            "generic.name",
          ])
          .limit(limit)
          .orderBy("medicine.name", "ASC")
          .getMany();

        return medicines;
      }

      return null;
    } catch (error) {
      apiWriteLog.error("Services Medicine Combo Query  Name ", error);
      return null;
    }
  }

  async getAllByQueryName(name: string, limit: number | any = 50) {
    try {
      apiWriteLog.info("Services Medicine Name Query, ", name);

      if (!esIsEmpty(name)) {
        if (name.length === 1) {
          name = `${name}%`;
        } else {
          name = `%${name}%`;
        }

        const medicines = await AppDataSource.createQueryBuilder(
          Medicine,
          "medicine"
        )
          .where("medicine.name LIKE :name", { name })
          .leftJoinAndSelect("medicine.generic", "generic")
          .select([
            "medicine.name",
            "medicine.aliasName",
            "medicine.strength",
            "medicine.form",
            "medicine.price",
            "generic.name",
          ])
          .orderBy("medicine.name", "ASC")
          .limit(limit)
          .getMany();

        return medicines;
      }

      return null;
    } catch (error) {
      apiWriteLog.error("Services Medicine Query Name ", error);
      return null;
    }
  }

  async getAllByName(name: string) {
    try {
      apiWriteLog.info("Services Medicine name, ", name);

      const medicines = await AppDataSource.createQueryBuilder(
        Medicine,
        "medicine"
      )
        .where("medicine.name= :name", { name })
        .leftJoinAndSelect("medicine.company", "company")
        .leftJoinAndSelect("medicine.generic", "generic")
        .leftJoinAndSelect("generic.medicines", "medicines")
        .getMany();

      return medicines;
    } catch (error) {
      apiWriteLog.error("Services Medicine ", error);
      return null;
    }
  }

  async getAllByGeneric(name: string | any) {
    try {
      apiWriteLog.info("Services Medicine generic name, ", name);

      const generic = await genericService.getGenericByAliasName(name);

      if (generic) {
        const medicine = await AppDataSource.createQueryBuilder(
          Medicine,
          "medicine"
        )
          .where("medicine.generic= :generic", { generic: generic.id })
          .leftJoinAndSelect("medicine.company", "company")
          .leftJoinAndSelect("medicine.generic", "generic")
          .leftJoinAndSelect("generic.medicines", "medicines")
          .getMany();

        return medicine;
      }
      return null;
    } catch (error) {
      apiWriteLog.error("Services Medicine ", error);
      return null;
    }
  }

  async getMedicineByAliasName(aliasName: string | any) {
    try {
      apiWriteLog.info("Services Medicine Alias name, ", aliasName);
      const medicine = await AppDataSource.createQueryBuilder(
        Medicine,
        "medicine"
      )
        .where("medicine.aliasName= :aliasName", { aliasName: aliasName })
        .leftJoinAndSelect("medicine.company", "company")
        .leftJoinAndSelect("medicine.generic", "generic")
        .leftJoinAndSelect("generic.medicines", "medicines")
        .getOne();

      return medicine;
    } catch (error) {
      apiWriteLog.error("Services Medicine ", error);
      return null;
    }
  }

  async save(medicine: Partial<Medicine>) {
    let saveMedicine: Medicine | undefined | null = null;
    if (medicine !== undefined && medicine !== null) {
      const nMedicine: Medicine = this.mapMedicine(medicine);

      const queryRunner = AppDataSource.createQueryRunner();
      queryRunner.connect();

      await queryRunner.startTransaction();

      try {
        const metaDatas: MetaDeta[] = [];
        const tags: Tag[] = [];

        let user = await queryRunner.manager.findOne(User, {
          where: { id: 1 },
        });

        //Save New Metatdata

        if (medicine.metaDatas) {
          medicine.metaDatas.forEach(async (item, idx) => {
            if (item.id > 0 && nMedicine.addMetaData !== undefined) {
              nMedicine.addMetaData(item);
            } else {
              const insMetaData = queryRunner.manager.create(MetaDeta, item);
              metaDatas.push(insMetaData);
            }
          });
        }

        const metaDataList = await queryRunner.manager.save(
          MetaDeta,
          metaDatas
        );
        console.log(
          "After Save Metadat Array ",
          JSON.stringify(metaDataList, null, 2)
        );
        //Save new Tags
        if (medicine.tags) {
          medicine.tags.forEach(async (item, idx) => {
            if (item !== undefined) {
              if (item.id > 0 && medicine.addTag !== undefined) {
                nMedicine.addTag(item);

                item.medicines = [nMedicine];
              } else {
                const insTag = queryRunner.manager.create(Tag, item);
                tags.push(insTag);
              }
            }
          });
        }

        const dbTags = await queryRunner.manager.save(Tag, tags);
        console.log(
          "Current Tags After Save ",
          JSON.stringify(dbTags, null, 2)
        );

        nMedicine.addAllTag(dbTags);
        nMedicine.addAllMetaData(metaDataList);

        if (user !== null) {
          nMedicine.user = user;
        }

        console.log("CUrrent Medicine ", JSON.stringify(nMedicine, null, 2));

        const insMedicine = queryRunner.manager.create(Medicine, nMedicine);
        saveMedicine = await queryRunner.manager.save(insMedicine);
        let pId = 0;
        if (saveMedicine !== null && saveMedicine !== undefined) {
          pId = saveMedicine.id !== undefined ? Number(saveMedicine.id) : 0;
        }
        let dbProdut: Medicine | null = null;
        const images: ImageGallery[] = [];
        if (medicine.images && pId > 0) {
          dbProdut = await queryRunner.manager.findOne(Medicine, {
            where: { id: pId },
          });

          medicine.images.forEach(async (image) => {
            if (dbProdut !== null) {
              image.medicines = dbProdut;
              const insImage = queryRunner.manager.create(ImageGallery, image);
              images.push(insImage);
            }
          });

          const dbImages = await queryRunner.manager.save(ImageGallery, images);
        }
        await queryRunner.commitTransaction();
        saveMedicine.addAllImage(images);
      } catch (error) {
        apiWriteLog.error("Medicine Save Error ", error);
        await queryRunner.rollbackTransaction();
      } finally {
        console.log("Query Runner ", queryRunner.isReleased);
        if (queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    }
    return saveMedicine;
  }

  async getById(id: string): Promise<Medicine | null | undefined> {
    this.initRepository();
    try {
      const Medicine = await this.medicineRepository
        ?.createQueryBuilder("medicine")
        ?.leftJoinAndSelect("medicine.generic", "generic")
        .where({ publicId: id })
        .getOne();
      return Medicine;
    } catch (err) {
      apiWriteLog.error("Error getMedicineByID ", err);
      return null;
    }
  }

  async getAll(
    size: number = 30,
    start: number = 0
  ): Promise<Medicine[] | null | undefined> {
    this.initRepository();
    try {
      //company: Company;
      let medicines = [];
      if (size > 0) {
        medicines = await AppDataSource.createQueryBuilder(Medicine, "medicine")
          .leftJoinAndSelect("medicine.generic", "generic")
          .leftJoinAndSelect("medicine.company", "company")
          .limit(size)
          .offset(start)
          .getMany();
      } else {
        medicines = await AppDataSource.createQueryBuilder(Medicine, "medicine")
          .leftJoinAndSelect("medicine.generic", "generic")
          .leftJoinAndSelect("medicine.company", "company")
          .getMany();
      }

      return medicines;
    } catch (err) {
      apiWriteLog.error(`Error All Medicine `, err);
      return null;
    }
  }

  async getAllForSearch(): Promise<Medicine[] | null | undefined> {
    this.initRepository();
    try {
      //company: Company;
      const medicines = await AppDataSource.createQueryBuilder(
        Medicine,
        "medicine"
      )
        .leftJoinAndSelect("medicine.generic", "generic")
        .select(["medicine.name", "medicine.form", "generic.name"])
        .getMany();

      return medicines;
    } catch (err) {
      apiWriteLog.error(`Error All Medicine `, err);
      return null;
    }
  }

  async update(
    medicine: Partial<Medicine>
  ): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(medicine)) {
      try {
        const updateMedicine = await this.medicineRepository?.update(
          { id: medicine.id },
          medicine
        );

        return updateMedicine;
      } catch (error) {
        apiWriteLog.error(`Update Medicine Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const Medicines = await this.medicineRepository?.delete({ id: id });
      return Medicines;
    } catch (err) {
      apiWriteLog.error("Error All Medicine ", err);
      return null;
    }
  }

  private mapMedicine(medicine: Partial<Medicine>): Medicine {
    const nMedicine = new Medicine();

    if (medicine.company !== undefined && medicine.company !== null) {
      nMedicine.company = medicine.company;
    }

    nMedicine.name = medicine.name ? medicine.name : "";
    if (medicine.aliasName !== undefined && medicine.aliasName !== null) {
      nMedicine.aliasName = medicine.aliasName;
    }
    // nMedicine.category = medicine.category ? medicine.category : 1;
    nMedicine.form = medicine.form ? medicine.form : "";
    // nMedicine.generic = medicine.generic ? medicine.generic : "";

    nMedicine.price = medicine.price !== undefined ? medicine.price : "0.0";
    nMedicine.strength = medicine.strength ? medicine.strength : "";

    return nMedicine;
  }
}

export const medicineService = new MedicineService();
