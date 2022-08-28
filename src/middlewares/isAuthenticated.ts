import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient()

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers["authorization"]){
        return res
        .status(400)
        .json({
            success: false,
            error: "No header provided"
        })
    }
    
    
    
    next()
}