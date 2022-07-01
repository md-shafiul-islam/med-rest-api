import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { medicineService } from "../service/medicine.service";
import { helperIsNumber } from "../utils/esHelper";
import respFormat from "../utils/response/respFormat";

class MedicineController {
  async getAll(req: Request, resp: Response) {
    let { start = 0, size = 50 } = req.query;
    start = helperIsNumber(start) ? 0 : Number(start);
    size = helperIsNumber(size) ? 50 : Number(size);
    try {
      const medicines = await medicineService.getAll(size, start);
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
      apiWriteLog.info("Get Medicine Alias  ", req.params);
      const medicine = await medicineService.getMedicineByAliasName(
        req.params.aliasName
      );
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
