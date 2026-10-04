import express from "express"
import http from "http"

import { Server } from "socket.io"
import { Server_Operations } from "./src/ws/server-handling";
import cors from "cors"

const app= express();


const server = http.createServer(app)


const io = new Server(server , {
    cors:{
        origin:"http://localhost:3000"
    }
});

Server_Operations(io)

server.listen(3001, ()=>{
    console.log(`Server is listening `)
})

