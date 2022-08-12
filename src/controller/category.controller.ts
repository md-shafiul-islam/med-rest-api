import { Request, Response } from "express";
import { apiWriteLog } from "../logger/writeLog";
import { Category } from "../model/Category";
import { categoryService } from "../service/category.service";
import respFormat from "../utils/response/respFormat";

class CategoryController {

  async getAll(req: Request, resp: Response) {
    try {
      const categories = await categoryService.getAllCategory();
      resp.status(200);
      resp.send(respFormat(categories, "Categories found", true));
    } catch (error) {
      apiWriteLog.error("Categories found by ID ", error);
      resp.status(200);
      resp.send(respFormat(null, "Categories not found", false));
    }
  }

  async getCategoryTree(req: Request, resp: Response) {
    try {
      const categories = await categoryService.getCategoryTree();
      resp
        .status(200)
        .send(respFormat(categories, "Category Tree found", true));
    } catch (error) {
      resp.status(200).send(respFormat(null, "Category Tree not found", false));
    }
  }

  async getById(req: Request, resp: Response) {
    let { id } = req.params;
    try {
      const intid: number = Number(id);
      const category = await categoryService.getCategoryById(intid);
      resp.status(200);
      resp.send(respFormat(category, "Category found", true));
    } catch (error) {
      apiWriteLog.error("Category found by ID ", error);
      resp.status(200);
      resp.send(respFormat(null, "Category not found", false));
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
}

export const categoryController = new CategoryController();
