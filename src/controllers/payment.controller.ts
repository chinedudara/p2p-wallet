import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

import { payment_integration } from "../config/app.config";
import AccountService from "../service/account.services";
import HttpCodes from "../common/httpcodes";
import httpcodes from "../common/httpcodes";

class PaymentController {
  async ProcessFunding(req: Request, res: Response, next: NextFunction) {
    //check permitted IPs
    if (!payment_integration.valid_ips.includes(req.socket?.remoteAddress || "")){
      
      res.status(httpcodes.SERVER_ERROR).send
    }

    //validate event
    const hash = crypto
      .createHmac("sha512", payment_integration.secret_key)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const event: any = req.body;
      console.log("Received webhook event :: ", event);
      

      // Do something with event
      if (event.event !== "charge.success") {

        // Ideal response
        // res.status(HttpCodes.SERVER_ERROR).json({
        //   status: false,
        //   message: "Funding failed. Error from paystack",
        // });

        // But sent 200-Ok so paystack won't keep resending
        res.status(HttpCodes.OK).send();
      }

      // const result = await AccountService.fundAccount(
      //   event.data.account,
      //   event.data.amount,
      //   JSON.stringify(req.body)
      // );
    }
    res.status(HttpCodes.OK).send();
  }
}

export default new PaymentController();
