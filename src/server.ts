import { accountRoute } from './routes/account.routes';
import { userRoute } from './routes/user.routes';
import { paymentRoute } from './routes/payment.routes';
import { isAuthenticated } from './middlewares/auth.middleware';
import express from 'express';
import dayjs from "dayjs";
import consola, { Consola} from 'consola';
import cors from 'cors';
import * as dotenv from "dotenv";
// import PaymentService from "./service/payment.services";

import { authRoute as AuthRoute } from "./routes/auth.routes";

export class Server{
    public app: express.Application
    public logger: Consola = consola

    public constructor(){
        this.app = express()
    }

    public async start(){
        this.setConfig()
        this.setRequestLogger()
        this.setRoutes()
        // const test = await PaymentService.initiatePayment("test@tester.com", 200)
        // console.log(test);
        

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
            this.logger.info(`${dayjs().format()} :: [${req.method} - ${req.path}]`)

            next()
        })
    }

    private setRoutes(){
        this.app.get('/', (req, res) => {
            res.json({success: true, message: 'Welcome to p2p wallet. Login or Signup to continue.'})
        })

        this.app.use('/api/v1/auth', AuthRoute)
        this.app.use('/api/v1/user', isAuthenticated, userRoute)
        this.app.use('/api/v1/account', isAuthenticated, accountRoute)
        this.app.use('/api/v1/webhook', paymentRoute)
    }
}