import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

import HttpCodes from "../common/httpcodes";
import { RequestAuth } from "../../typings/typings";
import AccountService from "../service/account.services";
import UserService from "../service/user.services";
import { common_config } from "../config/app.config";
import { signupData } from "../models/dataobject.model";

const prisma = new PrismaClient();

class AuthController {
  async LoginUser(req: RequestAuth, res: Response, next: NextFunction) {
    const { username, password }: { username: string; password: string } =
      req.body;

      if(!username?.trim() || !password?.trim())
    return res.status(400).json({
      success: false,
      error: "Username and Password must be provided",
    });

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(HttpCodes.USER_ERROR).json({
        success: false,
        error: "User not found",
      });
    }

    try {
      if (await argon2.verify(user.password, password)) {
        const accessToken = jwt.sign(
          { userId: user.id },
          common_config.tokenSecret,
          {
            expiresIn: common_config.tokenTimespan,
          }
        );
        return res.status(200).json({
          success: true,
          accessToken: accessToken,
        });
      } else {
        return res.status(HttpCodes.USER_ERROR).json({
          success: false,
          error: "Invalid password",
        });
      }
    } catch (err) {
      return res.status(HttpCodes.SERVER_ERROR).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async SignupUser(req: RequestAuth, res: Response, next: NextFunction) {
    let {
      email,
      username,
      password,
      pin,
      first_name,
      last_name,
      home_address,
      phone_number,
    }: signupData = req.body;

    if(!email?.trim() || !username?.trim() || !password?.trim())
    return res.status(400).json({
      success: false,
      error: "Email, Username and Password must be provided",
    });

    if (pin) {
      if (pin.trim().length !== 4 || hasNonNumeric(pin))
        return res.status(400).json({
          success: false,
          error: "Transaction PIN must be 4 digit number",
        });
      pin = await argon2.hash(pin);
    }

    function hasNonNumeric(pin: string): boolean {
      let nonNumeric = pin.split("").filter(x => isNaN(parseInt(x)))
      return nonNumeric.length > 0
    }

    const result = await UserService.CheckUserExist(username, email);

    if (result) {
      return res.status(400).json({
        success: false,
        error: "Username or Email already exists",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const genAcc = await AccountService.generateAccountNumber();
    const user = await UserService.createUser({
      username,
      email,
      pin,
      first_name,
      last_name,
      home_address,
      phone_number,
      password: hashedPassword,
      account_number: genAcc,
    });

    const accessToken = jwt.sign(
      { userId: user.id },
      common_config.tokenSecret,
      {
        expiresIn: common_config.tokenTimespan,
      }
    );
    return res.status(200).json({
      success: true,
      accessToken: accessToken,
    });
  }
}

export default new AuthController();
