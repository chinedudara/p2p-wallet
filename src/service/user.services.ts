import { PrismaClient } from "@prisma/client";
import { UserData } from "../models/dataobject.model";

const prisma = new PrismaClient();

class UserService {
  private User: any;

  constructor() {
    this.User = prisma.user;
  }

  async getUserById(userId: number) {
    const user = this.User.findUnique({
      where: { id: userId },
      include: { account: true }
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = this.User.findUnique({
      where: { email },
      include: { account: true }
    });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = this.User.findUnique({
      where: { username },
      include: { account: true }
    });
    return user;
  }

  async CheckUserExist(username: string, email: string): Promise<boolean> {
    const user = await this.User.findMany({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    })
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
  }: UserData) {
    
    const user = this.User.create({
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
}

export default new UserService();
