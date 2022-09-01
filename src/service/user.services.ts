import argon2 from 'argon2';
import { PrismaClient, user, Prisma } from "@prisma/client";
import { UserData, UserViewData } from "../models/dataobject.model";

const prisma = new PrismaClient();

class UserService {
  private User: any;

  constructor() {
    this.User = prisma.user;
  }

  async getUserById(userId: number): Promise<user> {
    const user = await this.User.findUnique({
      where: { id: userId },
      include: { account: true },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<user> {
    const user = await this.User.findUnique({
      where: { email },
      include: { account: true },
    });
    return user;
  }

  async getUserByUsername(username: string): Promise<user> {
    const user = await this.User.findUnique({
      where: { username },
      include: { account: true },
    });
    return user;
  }

  async CheckUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.User.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return user.length > 0;
  }

  async createUser({
    email,
    username,
    password,
    pin,
    first_name,
    last_name,
    home_address,
    phone_number,
    account_number,
  }: UserData): Promise<user> {
    const user = await this.User.create({
      data: {
        email,
        username,
        password,
        pin,
        first_name,
        last_name,
        home_address,
        phone_number,
        account: {
          create: {
            account_number,
          },
        },
      },
    });
    return user;
  }

  async setTransactionPin(id: number, pin: string): Promise<any> {

    const user = await this.getUserById(id)
    if(!user)
    return {
      success: false,
      message: "User not found"
    }
    if(user.pin)
    return {
      success: false,
      message: "PIN already set. Use change PIN to alter"
    }

    pin = await argon2.hash(pin)
    await this.User.update({
      where: { id },
      data: { pin, updated_at: new Date() },
    });

    return {
      success: true,
      message: "PIN set successfully"
    };
  }

  async changeTransactionPin(id: number, oldPin: string, newPin: string): Promise<any> {

    const user = await this.getUserById(id)
    if(!user)
    return {
      success: false,
      message: "User not found"
    }

    if(!user.pin)
    return {
      success: false,
      message: "PIN not set. Use set pin"
    }
    
    if(!(await argon2.verify(user.pin, oldPin)))
    return {
      success: false,
      message: "Incorrect old PIN provided"
    }

    newPin = await argon2.hash(newPin)
    await this.User.update({
      where: { id },
      data: { pin: newPin, updated_at: new Date() },
    });

    return {
      success: true,
      message: "PIN changed successfully"
    };
  }

  exclude<user, Key extends keyof user>(
    user: user,
    ...keys: Key[]
  ): Omit<user, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }
}

export default new UserService();
