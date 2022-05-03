import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import {MongoClient, ObjectId} from 'mongodb';
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
//     const newParticipant = {...req.body, lastStatus: Date.now()} ;

//     const participantSchema = joi.object({
//         name: joi.string().required()
//     });

//     const validation = participantSchema.validate(newParticipant);
//         if(validation.error) {
//         res.status(422).send(validation.error.details);
//         return;
//     }

//     try{
//         await mongo
//         Client.connect();
//         db = mongoClient.db("batepapouol");

//         await db.collection("participant").insertOne({...newParticipant, name: new Date().getTime()});
//         res.sendStatus(201);
    
//         mongoClient.close();
//         if(){

//         } else {
//         res.status(409).send("Este nome já está em uso, escolha outro!");
//         return;
//         }  
//       } catch (e) {
//         res.status(500).send("Ocorreu um erro ao registrar este nome de usuário!", e);
//         mongoClient.close();
//       }
//     });
    
app.get("/participants", async (req, res) => {
    try {
        await mongoClient.connect();
        db = mongoClient.db("batepapouol");

        const participants = await db.collection("participant").find().toArray();
        res.send(participants);

        mongoClient.close();
      } catch (e) {
        res.status(500).send("Ocorreu um erro ao obter os participantes!", e);
        mongoClient.close();
      }
    });
      
app.post("/messages", async (req, res) => {
    const newMessage = { from, ...req.body };
    const from = req.header('User');
    const loggedUsers = await db.collection("participant").find().toArray();
    const loggedUsersCollection = loggedUsers.map(newParticipant => newParticipant.name);
    
    const messageSchema = joi.object({
        from: joi.string().valid(...loggedUsersCollection).required(),
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("message","private_message").required()
    });

    const validation = messageSchema.validate(newMessage);
        if(validation.error) {
        res.status(422).send(validation.error.details);
        return;
    }
    newMessage.time = dayjs(Date.now()).format("HH:mm:ss");

    try {
      await db.collection("messages").insertOne(newMessage);
      res.sendStatus(201);
    } catch (e) {
      res.status(500).send("Ocorreu um erro ao registrar a mensagem!", e);
    }
});

// app.get("/messages", async (req, res) => {
//     try {
//         const messages = await db.collection("message").find().toArray();
//         res.send(messages);
//       } catch (e) {
//         res.status(500).send("Ocorreu um erro ao obter os participantes!", e);
//       }
// });


// app.post("/status",async (req, res) => {
//     const status = req.body;

  

// });


// app.delete("/messages/messageId",async(req,res)=>{
//     const {messageId} = req.params;
//     try {
//         await mongoClient.connect();
//         db = mongoClient.db("batepapouol");
    
//         await db.collection("messages").deleteOne({"id": parseInt(messageId)});
//         res.status(200).send("Mensagem deletada com sucesso!");
    
//         mongoClient.close();
//       } catch(e) {
//         res.status(404).send("Ocorreu um erro ao deletar a mensagem!", e);
//         mongoClient.close();
//       }
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));