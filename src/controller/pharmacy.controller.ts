import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Pharmacy } from "../model/Pharmacy";
import { pharmacyService } from "../service/pharmacy.service";
import { helperIsNumber } from "../utils/esHelper";
import respFormat from "../utils/response/respFormat";

class PharmacyController {
  async getAll(req: Request, resp: Response) {
    try {
      let { start = 0, size = 300 } = req.query;
      start = helperIsNumber(start) ? 0 : Number(start);
      size = helperIsNumber(size) ? 300 : Number(size);
      const pharmacies = await pharmacyService.getAllpharmacy(start, size);
      resp.status(200);
      resp.send(
        respFormat(pharmacies, `${pharmacies?.length} Pharmacies found`, true)
      );
    } catch (error) {
      apiWriteLog.error("Pharmacies not found ", error);
      resp.status(200);
      resp.send(respFormat(null, "Pharmacies not found", false));
    }
  }

  async getByQuery(req: Request, resp: Response) {
    try {
      const { district, upazila_name, name } = req.query;
      const pharmacies = await pharmacyService.getByQuery({
        district,
        upazilaName: upazila_name,
        name,
      });

      if (pharmacies) {
        resp
          .status(200)
          .send(
            respFormat(
              pharmacies,
              `${pharmacies.length} pharmacy Found by Query`,
              true
            )
          );
      } else {
        resp
          .status(200)
          .send(respFormat(null, `pharmacy not Found by Query`, true));
      }
    } catch (error) {
      resp
        .status(200)
        .send(respFormat(null, "pharmacy not found by Query", false));
    }
  }

  async getById(req: Request, resp: Response) {
    let { id } = req.params;
    try {
      const intid: number = Number(id);
      const pharmacy = await pharmacyService.getById(intid);
      resp.status(200);
      resp.send(respFormat(pharmacy, "pharmacy found", true));
    } catch (error) {
      apiWriteLog.error("pharmacy found by ID ", error);
      resp.status(200);
      resp.send(respFormat(null, "pharmacy not found", false));
    }
  }

  async add(req: Request, resp: Response) {
    const pharmacy: Pharmacy = new Pharmacy();
    Object.assign(pharmacy, req.body);

    try {
      const nPharmacy = await pharmacyService.save(pharmacy);

      resp.status(201).send(respFormat(nPharmacy, "pharmacy added", true));
    } catch (error) {
      apiWriteLog.error("pharmacy Add Controller Error ", error);
      resp.status(202).send(respFormat(null, "pharmacy Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const { name, description, id, parent } = req.body;
    try {
      let pharmacy = new Pharmacy();
      Object.assign(pharmacy, req.body);
      // apiWriteLog.error("pharmacy Update Controller ... ");
      const npharmacy = await pharmacyService.updatePharmacy(pharmacy);

      resp.status(200).send(respFormat(npharmacy, "pharmacy Updated", true));
    } catch (error) {
      apiWriteLog.error("pharmacy Update Controller Error ", error);
      resp.status(202).send(respFormat(null, "pharmacy Update failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;
    try {
      let pId = Number(id);
      const npharmacy = await pharmacyService.deletePharmacy(pId);

      resp.status(201).send(respFormat(npharmacy, "pharmacy Deleted", true));
    } catch (error) {
      apiWriteLog.error("pharmacy Delete Error ", error);
      resp.status(202).send(respFormat(null, "Deleted failed", false));
    }
  }
}

export const pharmacyController = new PharmacyController();
