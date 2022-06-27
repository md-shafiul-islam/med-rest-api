import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Tag } from "../model/Tag";
import { esIsEmpty } from "../utils/esHelper";

class TagService {
  private tagRepository: Repository<Tag> | null = null;

  private initRepository(): void {
    if (this.tagRepository === null) {
      this.tagRepository = AppDataSource.getRepository(Tag);
    }
  }

  async save(tag: Partial<Tag>) {
    this.initRepository();
    if (tag) {
      try {
        const resp = await this.tagRepository?.save(tag);

        return resp;
      } catch (error) {
        apiWriteLog.error("tag Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<Tag | null | undefined> {
    this.initRepository();
    try {
      const tag = await this.tagRepository?.findOne({ where: { id: id } });
      return tag;
    } catch (err) {
      apiWriteLog.error("Error gettagByID ", err);
      return null;
    }
  }

  async getAll(): Promise<Tag[] | null | undefined> {
    this.initRepository();
    try {
      const tags = await this.tagRepository?.find();
      return tags;
    } catch (err) {
      apiWriteLog.error(`Error All tag `, err);
      return null;
    }
  }

  async update(tag: Partial<Tag>): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(tag)) {
      try {
        const updatetag = await this.tagRepository?.update(
          { id: tag.id },
          tag
        );

        return updatetag;
      } catch (error) {
        apiWriteLog.error(`Update tag Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const tags = await this.tagRepository?.delete({ id: id });
      return tags;
    } catch (err) {
      apiWriteLog.error("Error All tag ", err);
      return null;
    }
  }
}

export const tagService = new TagService();
