import { Request, Response, NextFunction } from 'express'

import HttpCodes from '../common/httpcodes';
import { RequestAuth } from "../../typings/typings";
import UserService from "../service/user.services";

class UserController {

    async GetUser (req: RequestAuth, res: Response) {
        // const { userId } = req.params
        // if(parseInt(userId) !== req.user?.id){
        //     res.status(400).json({success: false, message: "Unauthorized data request"})
        // }
    
        const result = await UserService.getUserByUsername(req.user?.username || "")
        console.log(req.user);
        
        res.status(HttpCodes.OK).json(result)
    }
}

export default new UserController();