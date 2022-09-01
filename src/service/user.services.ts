import { PrismaClient, user } from "@prisma/client";
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
