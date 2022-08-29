import { accountRoute } from './routes/account';
import { userRoute } from './routes/user';
import { isAuthenticated } from './middlewares/isAuthenticated';
import express from 'express'
import { PrismaClient } from '@prisma/client'
import consola, { Consola} from 'consola'
import cors from 'cors'
// import * as bodyParser from 'body-parser'
import * as dotenv from "dotenv"

import { auth as AuthRoute } from "./routes/auth";

export class Server{
    public app: express.Application
    public logger: Consola = consola
    private prisma: PrismaClient = new PrismaClient ()

    public constructor(){
        this.app = express()
    }

    public start(){
        this.setConfig()
        this.setRequestLogger()
        this.setRoutes()

        this.app.listen(process.env.PORT, () => {
            this.logger.success(`Server started on port ${process.env.PORT}`)
        })
    }

    private setConfig(){
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(cors())

        dotenv.config()
    }

    private setRequestLogger(){
        this.app.use(async (req, res, next) => {
            this.logger.info(`${new Date().toString()} :: [${req.method} - ${req.path}]`)

            next()
        })
    }

    private setRoutes(){
        this.app.get('/', (req, res) => {
            res.json({success: true, message: 'Welcome to p2p wallet. Login to continue.'})
        })

        this.app.use('/api/v1/auth', AuthRoute)
        this.app.use('/api/v1/user', isAuthenticated, userRoute)
        this.app.use('/api/v1/account', isAuthenticated, accountRoute)
    }

    // public async sendQuery(): Promise<void>{
    //     let result = await this.prisma.user.create({
    //         data:{
    //             email: "testuser@gmail.com",
    //             name: "Test User"
    //         }
    //     })

    //     console.log(result);
        
    // }

}