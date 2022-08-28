import { User } from "../model/User";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/AppDataSource";
import { esIsEmpty } from "../utils/esHelper";
import { apiWriteLog } from "../logger/writeLog";
class JwtAuthServices {
  async genaretJwtToken(user: User) {
    let signToken = "";
    if (user) {
      try {
        const {
          firstName,
          lastName,
          email,
          userName,
          publicId,
          isActive,
          role,
        } = user;
        const secretKey = await this.getTokenSecretKey();
        signToken = jwt.sign(
          {
            firstName,
            lastName,
            email,
            userName,
            id: publicId,
            isActive,
            role,
          },
          secretKey
        );

        return signToken;
      } catch (error) {
        apiWriteLog.error("Create Token Failed ", error);
      }
    }
    return signToken;
  }

  async getTokenSecretKey() {
    const secretKey =
      process.env.JWT_SECRET_KEY !== undefined
        ? process.env.JWT_SECRET_KEY
        : "d5bfd5fa9a5f1e3dc24084a6d906de048e8bfcd4c34e2057d3059070ab3217e9d342f312b04dffbdb6d9593a1dcd132fb128dfb08f424eb5690fcb21988ca204";
    return secretKey;
  }

  async verifyToken(token: any) {
    let vToken = null;

    try {
      if (!esIsEmpty(token)) {
        if (typeof token === "string") {
          const splitToken = token.substring(7);

          if (!esIsEmpty(splitToken)) {
            const secretKey = await this.getTokenSecretKey();

            vToken = jwt.verify(splitToken, secretKey);
          }
        }
      }
    } catch (error) {
      apiWriteLog.error("JWT Token Verify Error ", error);
    }

    return vToken;
  }
}

export const jwtAuthServices = new JwtAuthServices();
