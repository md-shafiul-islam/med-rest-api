import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Company } from "../model/Company";
import { companyService } from "../service/company.service";
import { esIsEmpty } from "../utils/esHelper";
import respFormat from "../utils/response/respFormat";

class CompanyController {
  
  async getByAliasName(req: Request, resp: Response) {
    try {
      const aliasName = req?.params?.aliasName;

      const company = await companyService.getCompanyByAliasName(aliasName);

      if (company) {
        resp.status(200);
        resp.send(respFormat(company, "company Found", true));
      } else {
        resp.status(202);
        resp.send(
          respFormat(company, "company not Found by given alias name", false)
        );
      }
    } catch (error) {
      apiWriteLog.error("Company Alias name ", error);
      resp.status(202);
      resp.send(
        respFormat(null, "company not Found by given Alias name", false)
      );
    }
  }

  async getAll(req: Request, resp: Response) {
    apiWriteLog.info("Test writ file", { test: "Object is write" });
    const companys = await companyService.getAllCompany();
    if (companys) {
      resp.status(200);
      resp.send(respFormat(companys, "company found", true));
    } else {
      resp.status(202);
      resp.send(respFormat(companys, "company not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = parseInt(req?.params?.id);
    const company = await companyService.getCompanyById(id);

    if (company) {
      resp.status(200);
      resp.send(respFormat(company, "company Found", true));
    } else {
      resp.status(202);
      resp.send(respFormat(company, "company not Found by given id", true));
    }
  }

  async add(req: Request, resp: Response) {
    console.log("company Add Request Body ", req.body);

    const companyReq: Partial<Company> = req.body;

    console.log("After Partial company Add Request Body ", companyReq);

    const { name, description, tagLine, logoUrl, website } = req.body;

    try {
      const ncompany = await companyService.save({
        name,
        description,
        tagLine,
        logoUrl,
        website,
      });

      console.log("company added Response ", ncompany);

      resp.status(201);
      resp.send(respFormat(ncompany, "company Save Or Added", true));
    } catch (error) {
      resp.status(202);
      resp.send(respFormat(null, "company Added failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const {
      id,
      name,
      description,
      tagLine,
      logoUrl,
      website,
      companyKey,
      aliasName,
    } = req.body;
    const company: Company = {
      id,
      name,
      description,
      tagLine,
      logoUrl,
      website,
      medicines: [],
      news: [],
      companyKey,
      aliasName,
    };
    const updatecompany = await companyService.updateCompany(company);

    if (updatecompany !== undefined && updatecompany !== null) {
      resp.status(202);
      resp.send(respFormat(updatecompany, "company updated", true));
    } else {
      resp.status(202);
      resp.send(respFormat(null, "company update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;
    const intId = parseInt(id);

    if (intId > 0) {
      const deleteResp = await companyService.deleteCompany(intId);

      if (deleteResp) {
        resp.status(202);
        resp.send(respFormat(deleteResp, "company deleted ", true));
      }
    }
    resp.status(202);
    resp.send(respFormat(null, "company delete failed", false));
  }
}

export const companyController = new CompanyController();
