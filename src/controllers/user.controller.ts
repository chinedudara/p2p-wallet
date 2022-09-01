import { UserViewData } from "./../models/dataobject.model";
import { Request, Response, NextFunction } from "express";

import HttpCodes from "../common/httpcodes";
import { RequestAuth } from "../../typings/typings";
import UserService from "../service/user.services";

class UserController {
  async GetUser(req: RequestAuth, res: Response) {
    // const { userId } = req.params
    // if(parseInt(userId) !== req.user?.id){
    //     res.status(400).json({success: false, message: "Unauthorized data request"})
    // }

    const result = await UserService.getUserByUsername(
      req.user?.username || ""
    );

    const data: any = UserService.exclude(
      result,
      "password",
      "pin",
      "created_at",
      "updated_at"
    );

    delete data.account?.created_at;
    delete data.account?.updated_at;
    delete data.account?.user_id;
    // console.log(data);

    res.status(HttpCodes.OK).json(data);
  }

  async SetPin(req: RequestAuth, res: Response) {
    const { pin }: { pin: string } = req.body;

    if (!pin) return { success: false, message: "PIN must be provided" };

    const result = await UserService.setTransactionPin(req.user?.id || 0, pin);

    res.status(HttpCodes.OK).json(result);
  }

  async ChangePin(req: RequestAuth, res: Response) {
    const { old_pin, new_pin }: { old_pin: string; new_pin: string } = req.body;

    if (!old_pin || !new_pin) return { success: false, message: "old and new PIN must be provided" };

    const result = await UserService.changeTransactionPin(
      req.user?.id || 0,
      old_pin,
      new_pin
    );

    res.status(HttpCodes.OK).json(result);
  }
}

export default new UserController();
