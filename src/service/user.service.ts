import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import { apiWriteLog } from "../logger/writeLog";
import { Credential } from "../model/Credential";
import { User } from "../model/User";
import { esIsEmpty } from "../utils/esHelper";
import bcrypt from "bcrypt";
import { jwtAuthServices } from "./jwtAuthServices.services";
class UserService {
  private userRepository: Repository<User> | null = null;

  private roundVal = 15;

  private initRepository(): void {
    if (this.userRepository === null) {
      this.userRepository = AppDataSource.getRepository(User);
    }
  }

  async getBCryptHash(password: string) {
    const salt = await bcrypt.genSalt(this.roundVal);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async save(params: any) {
    this.initRepository();
    let userResp = null,
      respCred = null;
    if (params) {
      const queryRunner = AppDataSource.createQueryRunner();
      queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const { firstName, lastName, userName, email, password, cPass } =
          params;

        const user = new User();
        user.userName = userName;
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;

        const credential = new Credential();
        credential.isActive = true;
        if (cPass === password) {
          const hashPass = await this.getBCryptHash(password);
          if (typeof hashPass === "string") {
            credential.password = hashPass;
          } else {
            return null;
          }
        } else {
          return null;
        }

        queryRunner.manager.create(User, user);
        userResp = await queryRunner.manager.save(user);
        credential.user = user;

        queryRunner.manager.create(Credential, credential);
        respCred = await queryRunner.manager.save(credential);

        await queryRunner.commitTransaction();
      } catch (error) {
        apiWriteLog.error("User Save Error ", error);
        await queryRunner.rollbackTransaction();
      } finally {
        if (queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    }
    return { user: userResp, cred: respCred };
  }

  async getUserLogin(useInf: any) {
    let user = null;
    try {
      if (useInf) {
        user = await AppDataSource.createQueryBuilder(User, "user")
          .leftJoinAndSelect("user.credentials", "credentials")
          .where({ email: useInf.userName })
          .orWhere({ userName: useInf.useInf })
          .getOne();

        if (user) {
          let password = "";
          if (Array.isArray(user.credentials)) {
            user.credentials.forEach((credential: Credential) => {
              if (credential.isActive) {
                password = credential.password;
              }
            });
          } else {
            return null;
          }
          if (useInf.password) {
            const userStatus = await bcrypt.compare(useInf.password, password);

            if (userStatus) {
              user.credentials = [];
              const token = await jwtAuthServices.genaretJwtToken(user);
              return { token: `Bearer ${token}` };
            } else {
              return null;
            }
          }
        }
      }
    } catch (error) {}
    return user;
  }

  async getNextUserLogin(useInf: any) {
    let user = null;
    try {
      if (useInf) {
        user = await AppDataSource.createQueryBuilder(User, "user")
          .leftJoinAndSelect("user.credentials", "credentials")
          .where({ email: useInf.username })
          .orWhere({ userName: useInf.username })
          .getOne();

        if (user) {
          let password = "";
          if (Array.isArray(user.credentials)) {
            user.credentials.forEach((credential: Credential) => {
              if (credential.isActive) {
                password = credential.password;
              }
            });
          } else {
            return null;
          }
          if (useInf.password) {
            const userStatus = await bcrypt.compare(useInf.password, password);

            if (userStatus) {
              user.credentials = [];
              const { publicId, firstName, lastName, userName, email, role } =
                user;

              return {
                id: publicId,
                firstName,
                lastName,
                username: userName,
                email,
                role,
              };
            } else {
              return null;
            }
          }
        }
      }
    } catch (error) {}
    return user;
  }

  async getUserByPublicId(id: any) {
    try {
      if (id !== undefined && id !== null) {
        const user = await AppDataSource.createQueryBuilder(User, "user")
          .where({ publicId: id })
          .getOne();

        return user;
      }
      return null;
    } catch (err) {
      apiWriteLog.error("Error getuserByID ", err);
      return null;
    }
  }

  async getById(id: any): Promise<User | null | undefined> {
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
