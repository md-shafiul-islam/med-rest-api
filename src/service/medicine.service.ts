import { EntityManager, Repository, UpdateResult } from "typeorm";
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

class MedicineService {
  private medicineRepository: Repository<Medicine> | null = null;

  private initRepository(): void {
    if (this.medicineRepository === null) {
      this.medicineRepository = AppDataSource.getRepository(Medicine);
    }
  }

  async getMedicineByAllyName(aliasName: string) {
    this.initRepository();
    const medicine = await this.medicineRepository?.findOne({
      where: { aliasName },
    });
    return medicine;
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
      const medicines = await this.medicineRepository
        ?.createQueryBuilder("medicine")
        ?.leftJoinAndSelect("medicine.generic", "generic")
        ?.leftJoinAndSelect("medicine.company", "company")
        .limit(size)
        .offset(start)
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

    nMedicine.price = medicine.price ? Number(medicine.price) : 0;
    nMedicine.strength = medicine.strength ? medicine.strength : "";

    return nMedicine;
  }
}

export const medicineService = new MedicineService();
