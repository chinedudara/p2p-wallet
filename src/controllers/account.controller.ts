import { account } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

import HttpCodes from "../common/httpcodes";
import PaymentService from "../service/payment.services";
import AccountService from "../service/account.services";
import { RequestAuth } from "../../typings/typings";

class AccountController {
  async fundAccount(req: RequestAuth, res: Response, next: NextFunction) {
    const { amount } = req.body;
    const paymentResult = await PaymentService.initiatePayment(
      req.user?.email || "",
      amount
    );
    // console.log("this is it", paymentResult);

    if (!paymentResult.success) {
      res.status(HttpCodes.USER_ERROR).json({
        success: false,
        message: "Account funding failed",
      });
    }

    const fundingResult = await AccountService.fundAccount(
      req.user?.account_number || "",
      amount,
      JSON.stringify(paymentResult)
    );

    res.status(HttpCodes.OK).json(fundingResult);
  }

  async transferToUser(req: RequestAuth, res: Response, next: NextFunction) {
    const { recipient_account, amount } = req.body;

    const transferResult = await AccountService.transferToAccount({
      source_account: req.user?.account_number || "",
      destination_account: recipient_account,
      amount,
    });

    res.status(HttpCodes.OK).json(transferResult);
  }
}

export default new AccountController();
