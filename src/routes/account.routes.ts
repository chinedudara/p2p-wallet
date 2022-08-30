import { Router } from "express";
import AccountController from "../controllers/account.controller";

export const accountRoute = Router()

accountRoute.post('/fund', AccountController.fundAccount)
accountRoute.post('/transfer', AccountController.transferToUser)