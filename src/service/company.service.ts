import { Repository } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Company } from "../model/Company";
import { esIsEmpty } from "../utils/esHelper";

class CompanyService {
  private companyRepository: Repository<Company> | null = null;

  private initRepository(): void {
    if (this.companyRepository === null) {
      this.companyRepository = AppDataSource.getRepository(Company);
    }
  }

  async getCompanyByAliasName(aliasName: any) {
    try {
      const company = await this.companyRepository?.findOne({
        where: { aliasName: aliasName },
      });
      return company;
    } catch (err) {
      apiWriteLog.error("Error getCompanyByAliasName ", err);
      return null;
    }
  }

  async save(company: Partial<Company>) {
    this.initRepository();
    if (company) {
      try {
        const resp = await this.companyRepository?.save(company);

        return resp;
      } catch (error) {
        apiWriteLog.error("Company Save Failed ");
      }
    }
    return null;
  }

  async getCompanyById(id: number): Promise<Company | null | undefined> {
    this.initRepository();
    try {
      const company = await this.companyRepository?.findOne({
        where: { id: id },
      });
      return company;
    } catch (err) {
      apiWriteLog.error("Error getCompanyByID ", err);
      return null;
    }
  }

  async getAllCompany(): Promise<Company[] | null | undefined> {
    this.initRepository();
    try {
      const companies = await this.companyRepository?.find();
      return companies;
    } catch (err) {
      apiWriteLog.error(`Error All Company `, err);
      return null;
    }
  }

  async updateCompany(company: Company): Promise<Company | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(company)) {
      let id: number = 0;
      id = !esIsEmpty(company.id) ? Number(company.id) : 0;
      if (id > 0) {
        try {
          const dbCompany = await this.companyRepository?.findOneBy({ id });
          if (dbCompany !== null && dbCompany !== undefined) {
            dbCompany.description = !esIsEmpty(company.description)
              ? company.description
              : dbCompany.description;
            dbCompany.logoUrl = !esIsEmpty(company.logoUrl)
              ? company.logoUrl
              : dbCompany.logoUrl;
            dbCompany.name = !esIsEmpty(company.name)
              ? company.name
              : dbCompany?.name;
            dbCompany.tagLine = !esIsEmpty(company.tagLine)
              ? company.tagLine
              : dbCompany.tagLine;
            dbCompany.website = !esIsEmpty(company.website)
              ? company.website
              : dbCompany.website;

            const updateCompany = await this.companyRepository?.save(dbCompany);
            return updateCompany;
          }
        } catch (error) {
          apiWriteLog.error(`Update Company Error, `, error);
          return null;
        }
      }
    }
    return null;
  }
  async deleteCompany(id: number) {
    this.initRepository();
    try {
      const company = await this.companyRepository?.delete({ id: id });
      return company;
    } catch (err) {
      apiWriteLog.error("Error All Company ", err);
      return null;
    }
  }
}

export const companyService = new CompanyService();
