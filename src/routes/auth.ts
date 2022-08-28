import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export const auth = Router()
const prisma: PrismaClient = new PrismaClient()

auth.post('/login', async (req, res) => {
    
})

auth.post('/register', async (req, res) => {
    
})