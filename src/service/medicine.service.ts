import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { ImageGallery } from "../model/ImageGallery";
import { MetaDeta } from "../model/MetaData";
import { Medicine } from "../model/Medicine";
import { User } from "../model/User";
import { esIsEmpty } from "../utils/esHelper";
import { genericService } from "./generic.service";

class MedicineService {
  private medicineRepository: Repository<Medicine> | null = null;

  private initRepository(): void {
    if (this.medicineRepository === null) {
      this.medicineRepository = AppDataSource.getRepository(Medicine);
    }
  }

  async getAllSiteMapMedicine(start: number, size: number) {
    try {
      if (size > 0) {
        const medicines = await AppDataSource.createQueryBuilder(
          Medicine,
          "medicine"
        )
          .select([
            "medicine.name",
            "medicine.aliasName",
            "medicine.updateDate",
          ])
          .offset(start)
          .limit(size)
          .getMany();

        return medicines;
      } else {
        const medicines = await AppDataSource.createQueryBuilder(
          Medicine,
          "medicine"
        )
          .select([
            "medicine.name",
            "medicine.aliasName",
            "medicine.updateDate",
          ])
          .getMany();

        return medicines;
      }
    } catch (error) {
      apiWriteLog.error("Services Medicine Combo Query  Name ", error);
      return null;
    }
  }

  async getMedicinesCount() {
    try {
      this.initRepository();
      const resp = await this.medicineRepository?.count({});
      return resp;
    } catch (error) {
      apiWriteLog.error("Methods Count Error, ", error);
      return null;
    }
  }

  async getAllByQueryComboName(name: string, limit: number | any = 0) {
    try {
      apiWriteLog.info("Services Medicine Name Combo Query, ", name);

      if (!esIsEmpty(name)) {
        if (name.length === 1) {
          name = `${name}%`;
        } else {
          name = `%${name}%`;
        }
        let medicines = [];
        if (limit > 0) {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")

            .where("medicine.name LIKE :name", { name })
            .orWhere("generic.name LIKE :name", { name })
            .leftJoinAndSelect("medicine.company", "company")
            .select([
              "medicine.name",
              "medicine.aliasName",
              "medicine.strength",
              "medicine.form",
              "medicine.price",
              "generic.name",
              "generic.aliasName",
              "medicine.company",
            ])
            .limit(limit)
            .orderBy("medicine.name", "ASC")
            .getMany();
        } else {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .where("medicine.name LIKE :name", { name })
            .orWhere("generic.name LIKE :name", { name })
            .select([
              "medicine.name",
              "medicine.aliasName",
              "medicine.strength",
              "medicine.form",
              "medicine.price",
              "generic.name",
              "generic.aliasName",
              "company.name",
              "company.aliasName",
            ])
            .orderBy("medicine.name", "ASC")
            .getMany();
        }

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
        .leftJoinAndSelect("medicines.company", "medicines.company")
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

        let user = await queryRunner.manager.findOne(User, {
          where: { id: 1 },
        });

        //Save New Metatdata

        if (medicine.metaDatas) {
          medicine.metaDatas.forEach((item, idx) => {
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

        nMedicine.addAllMetaData(metaDataList);

        if (user !== null) {
          nMedicine.user = user;
        }

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
    size: number = -1,
    start: number = 0,
    letter: string | any = ""
  ): Promise<Medicine[] | null | undefined> {
    this.initRepository();
    try {
      //company: Company;

      let medicines = [];
      if (!esIsEmpty(letter)) {
        if (letter === "num") {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .where(`medicine.name regexp '^[0-9]+'`)
            .getMany();
          return medicines;
        }

        letter = `${letter}%`;

        if (size > 0) {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .where(`medicine.name LIKE :name`, { name: letter })
            .limit(size)
            .offset(start)
            .getMany();
        } else {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .where(`medicine.name LIKE :name`, { name: letter })
            .getMany();
        }
      } else {
        if (size > 0) {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .limit(size)
            .offset(start)
            .getMany();
        } else {
          medicines = await AppDataSource.createQueryBuilder(
            Medicine,
            "medicine"
          )
            .leftJoinAndSelect("medicine.generic", "generic")
            .leftJoinAndSelect("medicine.company", "company")
            .getMany();
        }
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
        .select([
          "medicine.name",
          "medicine.aliasName",
          "medicine.form",
          "generic.name",
        ])
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
