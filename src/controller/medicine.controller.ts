import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Medicine } from "../model/Medicine";
import { medicineService } from "../service/medicine.service";
import { helperIsNumber } from "../utils/esHelper";
import respFormat from "../utils/response/respFormat";

class MedicineController {
  async getAllMedicinesCount(req: Request, resp: Response) {
    try {
      const medicineResp = await medicineService.getMedicinesCount();
      console.log("Medicine Count ", medicineResp);
      resp.status(200);
      resp.send(respFormat(medicineResp, ` medicines Count`, true));
    } catch (error) {
      apiWriteLog.error("Medicine Count Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines Count failed"));
    }
  }

  async getAllByCommboQueryName(req: Request, resp: Response) {
    try {
      let medicines: Medicine[] = [];
      apiWriteLog.info("medicines By Query Combo ... ", req.params?.name);
      const limit = req.query.limit;
      const medicinesResp = await medicineService.getAllByQueryComboName(
        req.params?.name,
        limit
      );

      if (medicinesResp) {
        if (medicinesResp.length > 500) {
          medicines = medicinesResp.slice(500);
        } else {
          medicines = medicinesResp;
        }

        resp.status(200);
        resp.send(
          respFormat(
            medicines,
            `${medicines.length} medicines found by Query`,
            true
          )
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found by Query"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getAllByQueryName(req: Request, resp: Response) {
    try {
      apiWriteLog.info("medicines By Query Name ... ", req.query);
      const medicines = await medicineService.getAllByQueryName(
        req.params?.name,
        req.query?.limit
      );
      if (medicines) {
        resp.status(200);
        resp.send(
          respFormat(
            medicines,
            `${medicines.length} medicines found by Query`,
            true
          )
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found by Query"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getAllForSearch(req: Request, resp: Response) {
    try {
      const medicines = await medicineService.getAllForSearch();
      if (medicines) {
        resp.status(200);
        resp.send(
          respFormat(
            medicines,
            `${medicines.length} medicines found by Generic`,
            true
          )
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found by Generic"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getAllName(req: Request, resp: Response) {
    try {
      const medicines = await medicineService.getAllByName(req.params?.name);
      if (medicines) {
        resp.status(200);
        resp.send(
          respFormat(
            medicines,
            `${medicines.length} medicines found by Generic`,
            true
          )
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found by Generic"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getAllGeneric(req: Request, resp: Response) {
    const { generic } = req.params;

    try {
      const medicines = await medicineService.getAllByGeneric(generic);
      if (medicines) {
        resp.status(200);
        resp.send(
          respFormat(
            medicines,
            `${medicines.length} medicines found by Generic`,
            true
          )
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found by Generic"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getAll(req: Request, resp: Response) {
    let { start = 0, size = -1, letter = "" } = req.query;
    start = helperIsNumber(start) ? 0 : Number(start);
    size = helperIsNumber(size) ? -1 : Number(size);
    console.log("Page Query ", start, " Size ", size);
    try {
      const medicines = await medicineService.getAll(size, start, letter);
      if (medicines) {
        resp.status(200);
        resp.send(
          respFormat(medicines, `${medicines.length} medicines found`, true)
        );
      } else {
        resp.status(202);
        resp.send(respFormat(medicines, "medicines not found"));
      }
    } catch (error) {
      apiWriteLog.error("medicines getAll Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicines not found"));
    }
  }

  async getByAlias(req: Request, resp: Response) {
    try {
      // console.log("Get Medicine Alias Query  ", req.query)
      let query = req.url.substring(17);
      query = decodeURI(query);

      const medicine = await medicineService.getMedicineByAliasName(query);
      if (medicine) {
        resp.status(200);
        resp.send(respFormat(medicine, `Medicine found`, true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "Medicine not found"));
      }
    } catch (error) {
      apiWriteLog.error("Get Medicine Alias ", error);
      resp.status(202);
      resp.send(respFormat(null, "Medicine not found"));
    }
  }

  async getById(req: Request, resp: Response) {
    const id = req?.params?.id;

    try {
      const medicine = await medicineService.getById(id);
      if (medicine) {
        resp.status(200);
        resp.send(respFormat(medicine, "medicine found", true));
      } else {
        resp.status(202);
        resp.send(respFormat(medicine, "medicine not found"));
      }
    } catch (error) {
      apiWriteLog.error("medicine getById Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicine not found"));
    }
  }

  async add(req: Request, resp: Response) {
    try {
      const medicine = await medicineService.save(req.body);

      resp.status(201);
      resp.send(respFormat(medicine, "medicine Save Or Added", true));
    } catch (error) {
      apiWriteLog.error("medicine Add Error ", error);
      resp.status(202);
      resp.send(respFormat(null, " medicine Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    try {
      const update = await medicineService.update(req.body);

      if (update !== undefined && update !== null) {
        resp.status(202);
        resp.send(respFormat(update, "medicine updated", true));
      } else {
        resp.status(202);
        resp.send(respFormat(null, "medicine update failed", false));
      }
    } catch (error) {
      apiWriteLog.error("medicine Update Error, ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicine update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;

    try {
      const intId = parseInt(id);
      if (intId > 0) {
        const deleteResp = await medicineService.delete(intId);

        if (deleteResp) {
          resp.status(202);
          resp.send(respFormat(deleteResp, "medicine deleted ", true));
        }
      }
    } catch (error) {
      apiWriteLog.error("medicine Delete Error ", error);
      resp.status(202);
      resp.send(respFormat(null, "medicine delete failed", false));
    }
  }
}

export const medicineController = new MedicineController();
