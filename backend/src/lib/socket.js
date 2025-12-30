import {Server} from "socket.io"
import express from "express";
import http from "http";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

export function getRecieverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap={};//

io.on("connection", (socket) =>{
    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("dissconnect", ()=>{
        console.log("A user dissconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
})