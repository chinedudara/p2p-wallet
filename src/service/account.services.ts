import argon2 from "argon2";
import { PrismaClient, account } from "@prisma/client";
import { TransferData } from "../models/dataobject.model";
const prisma = new PrismaClient();

class AccountService {
  private Account: any;
  private DepositLog: any;
  private TransferLog: any;

  constructor() {
    this.Account = prisma.account;
    this.DepositLog = prisma.deposit_log;
    this.TransferLog = prisma.transfer_log;
  }

  async generateAccountNumber(): Promise<string> {
    // generates a 10 digit account number
    function generateRandomAccount(): string {
      return Math.floor(
        (Math.random() * 10000000000 + 1000000000) % 10000000000
      ).toString();
    }

    let generatedAcc = generateRandomAccount();
    let accExists = true;

    while (accExists) {
      const account = await this.fetchAccountByNumber(generatedAcc);
      if (!account) {
        accExists = false;
      } else {
        generatedAcc = generateRandomAccount();
      }
    }

    return generatedAcc;
  }

  generateReference(): string {
    const date = new Date();
    return `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  async fetchAccountByNumber(account_number: string): Promise<any> {
    const account = await this.Account.findFirst({
      where: { account_number },
      include: { user: true },
    });
    return account;
  }

  async fetchAccountByUser(userId: number): Promise<any> {
    const account = await this.Account.findUnique({
      where: { user_id: userId },
      include: { user: true },
    });
    return account;
  }

  async fundAccount(
    account_number: string,
    amount: number,
    transaction_data: string
  ): Promise<any> {
    const account = await this.fetchAccountByNumber(account_number);
    if (!account) return;
    // const newBalance: number = account.balance + (amount * 100); //convert back to Naira instead of Kobo
    const newBalance: number = account.balance + parseFloat(amount.toFixed(2));

    const accTopup = await this.Account.update({
      where: { id: account.id },
      data: {
        balance: newBalance,
        updated_at: new Date(),
      },
    });

    if (!accTopup)
      return {
        success: false,
        message: "Top-up failed",
      };

    const transRef = this.generateReference()
    await this.DepositLog.create({
      data: {
        user_id: account.user_id,
        account_number,
        amount,
        transaction_ref: transRef,
        transaction_data,
        balance: newBalance,
        status: "",
      },
    });

    return {
      success: true,
      balance: accTopup.balance,
      message: "Top-up successful",
    };
  }

  async transferToAccount({
    source_account,
    amount,
    destination_account,
    pin
  }: TransferData): Promise<any> {
    
    console.log(
      `Source-${source_account} :: destination-${destination_account}`
    );

    const source = await this.fetchAccountByNumber(source_account);
    const destination = await this.fetchAccountByNumber(destination_account);
    if (source_account === destination_account)
      return {
        status: false,
        message: "Can't transfer to self",
      };

    if (!source || !destination)
      return {
        status: false,
        message: "Invalid source or destination account",
      };

      // const sourceUser = await userServices.getUserById(source.user_id)
      if(!source.user.pin)
      return {
        status: false,
        message: "User PIN must be set to authorize this transaction",
      };

      if(!(await argon2.verify(source.user.pin, pin)))
      return {
        status: false,
        message: "Invalid transaction PIN",
      };

    if (amount > source.balance)
      return {
        status: false,
        message: "Insufficient balance",
      };

    const sourceBalance: number = source.balance - amount;
    const destBalance: number = destination.balance + amount;
    const transRef = this.generateReference();

    // console.log(
    //   `SourceBalance-${sourceBalance} :: destinationBalance-${destBalance}`
    // );

    const [sourceResult, destinationResult] = await prisma.$transaction([
      this.Account.update({
        where: { id: source.id },
        data: { balance: sourceBalance, updated_at: new Date() },
      }),
      this.Account.update({
        where: { id: destination.id },
        data: { balance: destBalance, updated_at: new Date() },
      }),
    ]);

    const status: boolean = !sourceResult || !destinationResult ? false : true;

    await this.TransferLog.create({
      data: {
        user_id: source.user_id,
        source_account,
        destination_account,
        amount,
        transaction_ref: transRef,
        balance: sourceBalance,
        status: status ? "Success" : "Failed",
      },
    });

    return {
      status,
      balance: sourceResult.balance,
      recipient: status
        ? {
            username: destination.user.username,
            account: destination.account_number,
            email: destination.user.email,
            amount,
          }
        : null,
      message: status ? `Transfer successful` : "Transfer failed",
    };
  }
}

export default new AccountService();
