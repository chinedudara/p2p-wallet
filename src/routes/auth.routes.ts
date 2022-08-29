import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import argon2 from 'argon2'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const auth = Router()
const AUTH_SECRET: any = process.env.AUTH_SECRET

auth.post('/login', async (req: Request, res: Response) => {
    const { username, password } : { username: string, password: string } = req.body;
    const user = await prisma.user.findUnique({
        where: { username }
    })
    
    if(!user){
        return res
        .status(400)
        .json({
            success: false,
            error: "User not found"
        })
    }

    try {
        if(await argon2.verify(user.password, password)){
            const accessToken = jwt.sign({userId: user.id}, AUTH_SECRET)
            return res.status(200).json({
                success: true,
                accessToken: accessToken
            })
        }
        else{
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Invalid password"
                })
        }
    } catch (err) {
        return res
        .status(400)
        .json({
            success: false,
            error: "Internal server error"
        })
    }
})

auth.post('/register', async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const result = await prisma.user.findUnique({
        where: { username }
    })
    
    if(result){
        return res
        .status(400)
        .json({
            success: false,
            error: "User already exists"
        })
    }

    const hashedPassword = await argon2.hash(password)

    const genAcc = Math.floor(((Math.random() * 10000000000 + 1000000000) % 10000000000)).toString()
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
            account: {
                create: {
                    account_number: genAcc
                }
            }
        }
    })

    const accessToken = jwt.sign({userId: user.id}, AUTH_SECRET)
    return res.status(200).json({
        success: true,
        accessToken: accessToken
    })
})