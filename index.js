import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import {MongoClient} from 'mongodb';
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json())
dotenv.config();

let database = null;
const mongoClient= new MongoClient(process.env.MONGO_URI); 
const promise = mongoClient.connect();
promise.then(() => {
    database = MongoClient.db("test")
    console.log(chalk.blue.bold("Banco funciona"));   
});
promise.catch(e=> console.log(chalk.red.bold("Não funcionou"),e));

app.post("/participants", (req, res) => {
    
});

app.get("/participants", (req, res) => {

});

app.post("/messages", (req, res) => {

});

app.get("/messages", (req, res) => {

});


app.post("/status", (req, res) => {

});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));