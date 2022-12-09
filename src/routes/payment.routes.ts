import { Router } from "express";
import PaymentController from "../controllers/payment.controller";

export const paymentRoute = Router();

paymentRoute.post("/", PaymentController.ProcessFunding);
