import { user } from "@prisma/client"
import { Request } from "express";

export interface TestReq extends Request {
    user?: {
        id: number,
        email: string,
        username: string,
        account_number: string | null,
        balance: decimal
    }
}