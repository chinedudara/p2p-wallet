import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import argon2 from 'argon2'

export const auth = Router()
const prisma: PrismaClient = new PrismaClient()

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
            const accessToken = jwt.sign({userId: user.id}, "secret")
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
    const { email, username, password } : { email: string, username: string, password: string }= req.body;
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

    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        }
    })

    const accessToken = jwt.sign({userId: user.id}, "secret")
    return res.status(200).json({
        success: true,
        accessToken: accessToken
    })
})