import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import {MongoClient} from 'mongodb';
import dotenv from "dotenv";
import dayjs from 'dayjs';
import joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json())
dotenv.config();

let db = null;
const mongoClient= new MongoClient(process.env.MONGO_URI); 

// app.post("/participants", async (req, res) => {
//     try{
//         201
//         422//erro
//         409 //nome ja utilizado
//     }
// });

// app.get("/participants", async (req, res) => {
//     try {
//         await mongoClient.connect();
//         db = mongoClient.db("partipants");

//         const participants = await db.collection("participant").find().toArray();
//         res.send(participant);

//         mongoClient.close();
//       } catch (e) {
//         res.status(500).send("Ocorreu um erro ao obter os participantes!", e);
//         mongoClient.close();
//       }
//     });
      
// app.post("/messages", async (req, res) => {
//     const newMessage = req.body;
//     try {
//     //   await db.collection("messages").insertOne({...newMessage, id: new Date().getTime()});
//       res.sendStatus(201);
//     } catch (e) {
//       res.status(500).send("Ocorreu um erro ao registrar a mensagem!", e);
//     }
// });

// app.get("/messages", async (req, res) => {
//     try {
//         const messages = await db.collection("message").find().toArray();
//         res.send(messages);
//       } catch (e) {
//         res.status(500).send("Ocorreu um erro ao obter os participantes!", e);
//       }
// });


// app.post("/status",async (req, res) => {

// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));