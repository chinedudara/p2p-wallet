import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { TestReq } from "../../typings/typings";

export const accountRoute = Router()
const prisma: PrismaClient = new PrismaClient()
const AUTH_SECRET: any = process.env.AUTH_SECRET

accountRoute.get('/fund/:accountNumber', async (req: TestReq, res: Response) => {
    const { accountNumber } = req.params
    // const result = await prisma.user.findMany()
    // if(parseInt(userId) !== req.user?.id){
    //     res.status(400).json({success: false, message: "Unauthorized data request"})
    // }

    // const rres = await prisma.user.findUnique({
    //     where: {
    //         id: req.user?.id
    //     },
    //     include: {
    //         account: true
    //     }
    // })
    
    // const data = prisma.account.up

    res.status(200).send()
})