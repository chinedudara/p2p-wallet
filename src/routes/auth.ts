import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export const auth = Router()
const prisma: PrismaClient = new PrismaClient()

auth.post('/login', async (req, res) => {
    
})

auth.post('/register', async (req, res) => {
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

    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: password
        }
    })

    const accessToken = jwt.sign({userId: user.id}, "secret")
    return res.status(200).json({
        success: true,
        accessToken: accessToken
    })
})