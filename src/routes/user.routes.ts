import { Router } from "express";
import UserController from "../controllers/user.controller";

export const userRoute = Router()

userRoute.get('/', UserController.GetUser)
userRoute.post('/setpin', UserController.SetPin)
userRoute.post('/changepin', UserController.ChangePin)