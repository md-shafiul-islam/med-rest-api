import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { User } from "../model/User";
import { esIsEmpty } from "../utils/esHelper";

class UserService {
  private userRepository: Repository<User> | null = null;

  private initRepository(): void {
    if (this.userRepository === null) {
      this.userRepository = AppDataSource.getRepository(User);
    }
  }

  async save(user: Partial<User>) {
    this.initRepository();
    if (user) {
      try {
        const resp = await this.userRepository?.save(user);

        return resp;
      } catch (error) {
        apiWriteLog.error("user Save Failed ");
      }
    }
    return null;
  }

  async getById(id: number): Promise<User | null | undefined> {
    this.initRepository();
    try {
      const user = await this.userRepository?.findOne({ where: { id: id } });
      return user;
    } catch (err) {
      apiWriteLog.error("Error getuserByID ", err);
      return null;
    }
  }

  async getAll(): Promise<User[] | null | undefined> {
    this.initRepository();
    try {
      const users = await this.userRepository?.find();
      return users;
    } catch (err) {
      apiWriteLog.error(`Error All user `, err);
      return null;
    }
  }

  async update(user: Partial<User>): Promise<UpdateResult | null | undefined> {
    this.initRepository();
    if (!esIsEmpty(user)) {
      try {
        const updateuser = await this.userRepository?.update(
          { id: user.id },
          user
        );

        return updateuser;
      } catch (error) {
        apiWriteLog.error(`Update user Error, `, error);
        return null;
      }
    }

    return null;
  }
  async delete(id: number) {
    this.initRepository();
    try {
      const users = await this.userRepository?.delete({ id: id });
      return users;
    } catch (err) {
      apiWriteLog.error("Error All user ", err);
      return null;
    }
  }
}

export const userService = new UserService();
