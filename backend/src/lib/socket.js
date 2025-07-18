import {Server} from "socket.io"
import http from "http"
import express from "express"



const app=express()
const server =http.createServer(app)

export function getReceiverSocketId(userId){
    return userSocketMap[userId]

}

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})
//used to store online users
const userSocketMap={}
io.on("connection",(socket)=>{
    console.log("A User connnected",socket.id)

    const userId=socket.handshake.query.userId
    if(userId) userSocketMap[userId]=socket.id
    
    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
        console.log("A User is disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
})

export {io,app,server}
