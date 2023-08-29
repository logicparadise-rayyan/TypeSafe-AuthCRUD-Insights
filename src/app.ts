import 'reflect-metadata';
import cookieParser from 'cookie-parser';
// import { DataSource } from "typeorm"
import { AppDataSource } from './Database/database';
import Routes from './interfaces/routes.interface';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
// import fileUpload from 'express-fileupload';

require('dotenv').config();
// import { Todos } from './migrations/entities/Todos';


class App {
    public app: express.Application;
    public port: string | number;
    public DB_HOST: string;

    constructor(routes:Routes[]){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.DB_HOST = process.env.DB_HOST || 'unknown';
        

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
       
        };


    public getServer() {
        return this.app;
        }


    public async connectToDatabase() {
        AppDataSource.initialize()
        .then(() => console.log(`database connected ${this.DB_HOST}`))
        .catch((error) => console.log("Error: ", error))
       
    }

    
    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        // this.app.use(fileUpload());
        }


    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
        }
      
}

export default App;