import { User } from "../model/User";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/AppDataSource";
import { JwtToken } from "../model/JwtToken";
import { esIsEmpty } from "../utils/esHelper";
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
        console.log("Create Token Failed ", error);
      }
    }
    return signToken;
  }

  async getTokenSecretKey() {
    const dbToken = await this.getDBToken();
    const secretKey =
      process.env.JWT_SECRET_KEY !== undefined
        ? process.env.JWT_SECRET_KEY
        : dbToken;
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
      console.log("JWT Token Verify Error ", error);
    }

    return vToken;
  }

  async getDBToken() {
    let token = "";
    const tokenResp = await AppDataSource.createQueryBuilder(
      JwtToken,
      "jwtToken"
    )
      .where({ id: 1 })
      .getOne();

    if (typeof tokenResp === "string") {
      token = tokenResp;
    } else {
      token = "";
    }

    return "";
  }
}

export const jwtAuthServices = new JwtAuthServices();
