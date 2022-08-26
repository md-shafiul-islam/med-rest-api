import { Repository, TreeRepository } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Category } from "../model/Category";

import { esIsEmpty } from "../utils/esHelper";

class CategoryService {
  private categoryRepository: Repository<Category> | null = null;
  private categoryTreeRepository: TreeRepository<Category> | null = null;

  private initRepository(): void {
    if (this.categoryRepository === null) {
      this.categoryRepository = AppDataSource.getRepository(Category);
    }

    if (this.categoryTreeRepository === null) {
      this.categoryTreeRepository = AppDataSource.getTreeRepository(Category);
    }
  }

  async save(category: Category) {
    this.initRepository();
    if (category) {
      try {
        const resp = await this.categoryRepository?.save(category);

        return resp;
      } catch (error) {
        apiWriteLog.error("category Save Failed ");
      }
    }
    return null;
  }

  async getCategoryById(id: number): Promise<Category | null | undefined> {
    this.initRepository();
    try {
      const category = await this.categoryRepository?.findOne({
        where: { id: id },
      });
      return category;
    } catch (err) {
      apiWriteLog.error("Error getcategoryByID ", err);
      return null;
    }
  }

  async getCategoryTree() {
    this.initRepository();
    try {
      const categories = await this.categoryTreeRepository?.findTrees();
      return categories;
    } catch (err) {
      apiWriteLog.error("Error get Tree Categories, ", err);
      return null;
    }
  }

  async getAllCategory(): Promise<Category[] | null | undefined> {
    this.initRepository();
    try {
      const categories = await this.categoryRepository?.find();
      return categories;
    } catch (err) {
      apiWriteLog.error(`Error All category `, err);
      return null;
    }
  }

  async updateCategory(
    name: string,
    description: string,
    id: number,
    parent: Category
  ) {
    this.initRepository();
    try {
      const dbCategory = await this.categoryRepository?.findOneBy({ id });
      if (dbCategory !== null && dbCategory !== undefined) {
        apiWriteLog.info("Category Update ... ");
        // let name: string = "";
        // let description: string = "";
        if (!esIsEmpty(description)) {
          dbCategory.description = description;
        }

        if (!esIsEmpty(name)) {
          dbCategory.name = name;
        }

        if (!esIsEmpty(parent)) {
          dbCategory.parent = parent;
        }

        const updateCategory = await this.categoryRepository?.save(dbCategory);
        apiWriteLog.info("Category Update Response ", updateCategory);
        return updateCategory;
      }
    } catch (error) {
      apiWriteLog.error(`Update category Error, `, error);
      return null;
    }
    return null;
  }
  async deleteCategory(id: number) {
    this.initRepository();
    try {
      const category = await this.categoryRepository?.delete({ id: id });
      return category;
    } catch (err) {
      apiWriteLog.error("Error Delete category ", err);
      return null;
    }
  }
}

export const categoryService = new CategoryService();
