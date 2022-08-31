import argon2 from "argon2";
import { PrismaClient, user } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { RequestAuth } from "../../typings/typings";
import { common_config } from "../config/app.config";

const prisma = new PrismaClient();
const AUTH_SECRET: any = process.env.AUTH_SECRET;

export const isAuthenticated = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers["authorization"]) {
    return res.status(400).json({
      success: false,
      error: "No header provided",
    });
  }

  const authHeader = req.headers["authorization"];
  const authMethod = authHeader.split(" ")[0];
  const token = authHeader.split(" ")[1];

  if (!authMethod || !token)
    return res
      .status(400)
      .json({ success: false, error: "Invalid Authorization Header" });
  if (authMethod !== "Bearer")
    return res
      .status(400)
      .json({ success: false, error: "Invalid Authorization Method" });

  let tokenBody: any;

  try {
    // console.log(common_config.tokenSecret);

    tokenBody = jwt.verify(token, common_config.tokenSecret);
  } catch {
    return res
      .status(400)
      .json({ success: false, error: "Invalid Token", invalidate: true });
  }

  console.log(tokenBody);

  if (!tokenBody.userId)
    return res.status(400).json({ success: false, error: "Invalid Token", invalidate: true });

  const user = await prisma.user.findUnique({
    where: { id: tokenBody.userId },
    include: { account: true },
  });

  if (!user) {
    console.log("Invalid Token: User does not exist");
    return res.status(400).json({ success: false, error: "Invalid Token", invalidate: true });
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    account_number: user.account?.account_number || null,
    balance: user.account?.balance,
  };

  return next();
};
