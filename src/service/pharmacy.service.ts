import { Brackets, Repository, TreeRepository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Pharmacy } from "../model/Pharmacy";


class PharmacyService {
  private pharmacyRepository: Repository<Pharmacy> | null = null;

  private initRepository(): void {
    if (this.pharmacyRepository === null) {
      this.pharmacyRepository = AppDataSource.getRepository(Pharmacy);
    }
  }

  async save(pharmacy: Pharmacy) {
    this.initRepository();
    if (pharmacy) {
      try {
        const resp = await this.pharmacyRepository?.save(pharmacy);

        return resp;
      } catch (error) {
        apiWriteLog.error("pharmacy Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<Pharmacy | null | undefined> {
    this.initRepository();
    try {
      const pharmacy = await this.pharmacyRepository?.findOne({
        where: { id: id },
      });
      return pharmacy;
    } catch (err) {
      apiWriteLog.error("Error get Pharmacy ByID ", err);
      return null;
    }
  }

  async getByQuery(query: any) {
    this.initRepository();
    try {
      const { district, upazilaName, name } = query;
      const pharmacies = await AppDataSource.createQueryBuilder(
        Pharmacy,
        "pharmacy"
      )
        .where("pharmacy.district= :district", {
          district,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where("pharmacy.upazilaName = :upazilaName", {
              upazilaName,
            }).orWhere("pharmacy.name like :name", { name: `%${name}%` });
          })
        )

        .getMany();
      return pharmacies;
    } catch (err) {
      apiWriteLog.error("Error get Pharmacies, ", err);
      return null;
    }
  }

  async getAllpharmacy(
    start: number,
    size: number
  ): Promise<Pharmacy[] | null | undefined> {
    this.initRepository();
    try {
      const pharmacies = await AppDataSource.createQueryBuilder(
        Pharmacy,
        "pharmacy"
      )
        .offset(start)
        .limit(size)
        .getMany();
      return pharmacies;
    } catch (err) {
      apiWriteLog.error(`Error All pharmacy `, err);
      return null;
    }
  }

  async updatePharmacy(parent: Pharmacy) {
    this.initRepository();
    try {
      const dbpharmacy = await this.pharmacyRepository?.findOneBy({
        id: parent.id,
      });
      if (dbpharmacy !== null && dbpharmacy !== undefined) {
        apiWriteLog.info("pharmacy Update ... ");
        // let name: string = "";
        // map befor Update

        const updatepharmacy = await this.pharmacyRepository?.save(dbpharmacy);
        apiWriteLog.info("pharmacy Update Response ", updatepharmacy);
        return updatepharmacy;
      }
    } catch (error) {
      apiWriteLog.error(`Update pharmacy Error, `, error);
      return null;
    }
    return null;
  }
  async deletePharmacy(id: number) {
    this.initRepository();
    try {
      const pharmacy = await this.pharmacyRepository?.delete({ id: id });
      return pharmacy;
    } catch (err) {
      apiWriteLog.error("Error Delete pharmacy ", err);
      return null;
    }
  }
}

export const pharmacyService = new PharmacyService();
