import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";

export const authRoute = Router()

authRoute.post('/login', AuthController.LoginUser)

authRoute.post('/register', AuthController.SignupUser)