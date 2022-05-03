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

app.post("/participants", async (req, res) => {
    const newParticipant = {...req.body, lastStatus: Date.now()} ;

    const participantSchema = joi.object({
        name: joi.string().required()
    });

    const validation = participantSchema.validate(newParticipant);
        if(validation.error) {
        res.status(422).send(validation.error.details);
        mongoClient.close();
    }

    try{
        await mongoClient.connect();
        db = mongoClient.db("batepapouol");

        await db.collection("participant").insertOne(newParticipant);
        res.status(201);
    
        mongoClient.close();
        let status = {
            from: user.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(user.lastStatus).format("HH:mm:ss")
          }
          await db.collection('message').insertOne(status);
          res.status(201);
        } catch (e) {
        res.status(500).send("Ocorreu um erro ao registrar este nome de usuário!", e);
        mongoClient.close();
      }
    });
    
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
    const loggedUsers = await db.collection("message").find().toArray();
    const loggedUsersCollection = loggedUsers.map(newParticipant => newParticipant.name);
    
    const messageSchema = joi.object({
        from: joi.string().valid(...loggedUsersCollection).required(),
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("newMessage","private_message").required()
    });

    const validation = messageSchema.validate(newMessage);
        if(validation.error) {
        res.status(422).send(validation.error.details);
        mongoClient.close();
    }
    newMessage.time = dayjs(Date.now()).format("HH:mm:ss");

    try {
      await db.collection("message").insertOne(newMessage);
      res.status(201);
    } catch (e) {
      res.status(500).send("Ocorreu um erro ao registrar a mensagem!", e);
    }
});

app.get("/messages", async (req, res) => {
    try {
        const messages = await db.collection("message").find().toArray();
        const loggedUser = req.header('User');
        const limit = parseInt(req.query.limit);
        const filteredMessages = messages.filter((message) => {

        if (
            message.type === 'status' || message.type === 'message' || 
            message.from === loggedUser || message.to === loggedUser
        ) {
            return true;
        } else {
            return false;
        }
    }); 
        let liveMessages;
        let liveMessagesUser;
        if(limit === NaN){
            liveMessages = filteredMessages.length;
        } else {
        liveMessages = limit;
        }
    
        liveMessagesUser = filteredMessages.slice(-liveMessages);
        res.send(liveMessagesUser);
        mongoClient.close();

    } catch (e) {
        res.status(500).send("Ocorreu um erro ao obter as mensagens!", e);
        mongoClient.close();  
      }
});
    
app.post("/status",async (req, res) => {
    const user = req.header('User');

    if(!user){
    res.status(400);
    mongoClient.close();;
    }
    try {
        const loggedUser = await db.collection('participants').findOne({ name: user });
        if(!loggedUser){
            res.status(404);
            mongoClient.close();
        }
        let timestamp = Date.now();
        await db.collection('participants').updateOne(
            { _id: loggedUser._id  },
            { $set: { lastStatus: timestamp } }
        );
        res.status(200);
        mongoClient.close();
        } catch (e) {
        res.status(500);
        mongoClient.close();
        }
        });

app.delete("/messages/:messageId",async(req,res)=>{
    const {messageId} = req.params.messageId;
    const user = req.header('User');
    
    try {
        await mongoClient.connect();
        db = mongoClient.db("batepapouol");

        const searchedMessage = await db.collection('message').findOne({_id: new ObjectId(messageId) });
        if(!searchedMessage){
        res.status(404).send("Ocorreu um erro ao deletar a mensagem!", e);
        mongoClient.close();
        }
        if(searchedMessage.from !== user){
        res.status(401);
        mongoClient.close();
        }
    
        await db.collection("message").deleteOne({"id": parseInt(searchedMessage._id)});
        res.status(200).send("Mensagem deletada com sucesso!");
        } catch (e) {
        res.status(500);
        mongoClient.close();
        }    
    
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));