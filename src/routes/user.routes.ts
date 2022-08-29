import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import argon2 from 'argon2'
import { TestReq } from "../../typings/typings";

export const userRoute = Router()
const prisma: PrismaClient = new PrismaClient()
const AUTH_SECRET: any = process.env.AUTH_SECRET

userRoute.get('/', async (req: TestReq, res: Response) => {
    // const { userId } = req.params
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
    console.log(req.user);
    
    res.status(200).json(req.user)
})