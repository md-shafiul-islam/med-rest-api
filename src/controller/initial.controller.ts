import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const csvToJson = require("csvtojson");

const xlsxj = require("xlsx-to-json");

import { apiWriteLog } from "../logger/writeLog";
import { Category } from "../model/Category";
import { Generic } from "../model/Generic";
import { categoryService } from "../service/category.service";
import { genericService } from "../service/generic.service";
import respFormat from "../utils/response/respFormat";

class InitialController {
  async getFileAndConvertToJSON(name: string) {
    const sprt = path.sep;
    const fileName = name;

    const filePath = path.join(__dirname, `${sprt}..${sprt}..${sprt}`);

    const csvToJsonFilePath = `${filePath}${fileName}`;
    const csvToJsonFile = await csvToJson.csv().fromFile(csvToJsonFilePath);
    return csvToJsonFile;
  }

  // initSaveAllGeniric() {
  //   this.saveAllGenericItem();
  // }

  async saveAllGeniric(req: Request, resp: Response) {
    try {
      const sprt = path.sep;
      // const fileName = `24-8-2022-Generic wise.xlsx`;
      const fileName = `24_8_2022_ Allopathic Final output.xlsx`;

      const filePath = path.join(
        __dirname,
        `${sprt}..${sprt}..${sprt}data-file${sprt}`
      );
      console.log("File Path ", filePath);
      const xlsxToJsonFilePath = `${filePath}${fileName}`;

      // const jsonFile = await csvToJson.csv().fromFile(`${filePath}${fileName}`);
      let xlsxToJson: any = [];

      await xlsxj(
        {
          input: xlsxToJsonFilePath,
          output: "medicines.json",
        },
        function (err: any, result: any) {
          if (err) {
            console.error(err);
          } else {
            xlsxToJson = result;
            console.log("result ", result);
          }
        }
      );

      const generics: Generic[] = [];

      // if (Array.isArray(jsonFile)) {
      //   jsonFile.forEach((item, idx) => {
      //     let initGeneric = new Generic();
      //     Object.assign(initGeneric, item);
      //     generics.push(initGeneric);

      //     console.log("Curent Item idx", idx);
      //   });
      // }

      resp.send(respFormat(null, `Genric size ${generics.length}`, true));
    } catch (error) {
      apiWriteLog.error("saveAllGeniric found by ID ", error);
      resp.status(200);
      resp.send(respFormat(null, "saveAllGeniric not found", false));
    }
  }

  async saveAllMedicine(req: Request, resp: Response) {
    try {
      const jsonFile = this.getFileAndConvertToJSON(
        `Final_output2.0_Med_Generic_Wise.csv`
      );

      const generics: Generic[] = [];

      if (Array.isArray(jsonFile)) {
        jsonFile.forEach((item, idx) => {
          let initGeneric = new Generic();
          Object.assign(initGeneric, item);
          generics.push(initGeneric);
        });
      }

      this.writJosnFile(generics, "generics");
      resp.send(respFormat(generics, `Genric size ${generics.length}`, true));
    } catch (error) {
      apiWriteLog.error("saveAllGeniric found by ID ", error);
      resp.status(200);
      resp.send(respFormat(null, "saveAllGeniric not found", false));
    }
  }

  async add(req: Request, resp: Response) {
    const { name, description, parent } = req.body;

    const category: Category = new Category();
    category.name = name;
    category.description = description;
    if (parent != null) {
      category.parent = parent;
    }

    try {
      const nCategory = await categoryService.save(category);

      resp.status(201).send(respFormat(nCategory, "Category added", true));
    } catch (error) {
      apiWriteLog.error("Category Add Controller Error ", error);
      resp.status(202).send(respFormat(null, "Category Add failed", false));
    }
  }

  async update(req: Request, resp: Response) {
    const { name, description, id, parent } = req.body;
    try {
      let idInt = Number(id);
      // apiWriteLog.error("Category Update Controller ... ");
      const nCategory = await categoryService.updateCategory(
        name,
        description,
        idInt,
        parent
      );

      resp.status(200).send(respFormat(nCategory, "Category Updated", true));
    } catch (error) {
      apiWriteLog.error("Category Add Controller Error ", error);
      resp.status(202).send(respFormat(null, "Category Add failed", false));
    }
  }

  async delete(req: Request, resp: Response) {
    const { id } = req.params;
    try {
      let catId = Number(id);
      const nCategory = await categoryService.deleteCategory(catId);

      resp.status(201).send(respFormat(nCategory, "Category Deleted", true));
    } catch (error) {
      apiWriteLog.error("Category Delete Error ", error);
      resp.status(202).send(respFormat(null, "Deleted failed", false));
    }
  }

  async writJosnFile(arrayData: any, name: string) {
    if (arrayData) {
      try {
        fs.writeFile(`${name}.json`, arrayData, (m) => {});
      } catch (error) {
        apiWriteLog.error("Json file write failed ", error);
      }
    }
  }
}

export const initialController = new InitialController();
