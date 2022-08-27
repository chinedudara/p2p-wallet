import express from 'express'
import consola, { Consola} from 'consola'
import cors from 'cors'
import * as bodyParser from 'body-parser'
import * as dotenv from "dotenv"

export class Server{
    public app: express.Application
    public logger: Consola = consola

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
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended:true}))
        this.app.use(cors())

        dotenv.config()
    }

    private setRequestLogger(){
        this.app.use(async (req, res, next) => {
            console.log(`[${req.method} - ${req.path}]`)

            next()
        })
    }

    private setRoutes(){
        this.app.get('/', (req, res) => {
            res.json({success: true, message: 'Welcome to p2p wallet. Login to continue.'})
        })
    }

}