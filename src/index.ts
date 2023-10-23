import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());

app.use("/", (req,res)=>{
    res.json({message : "hello"})
});

app.listen(PORT, ()=>{
    console.log(`application is up and running on port ${PORT}`);
});

