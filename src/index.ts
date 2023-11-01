import "reflect-metadata";
import * as express from "express";
import { AppDataSource } from './data-source';
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8000;

AppDataSource.initialize().then(() => {
   const app = express();
   app.use(express.json())

   return app.listen(process.env.POSTGRES_PORT, ()=>{
    console.log(`application is up and running on port ${PORT}`);
  });
})
