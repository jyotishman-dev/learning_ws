import express from "express"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
const app = express()





const server = http.createServer(app);


const io = new Server(server, {
    cors :{
        origin:"http://localhost:3000"
    }
});



io.on("connection", (user) => {
  console.log(`connected socket ${user.id}`)

  user.on("message", (data) => {
    console.log("server received:", data.message)

    io.emit("message", {
      socketId: user.id,
      message: data.message
    })
  })
})


server.listen(3001,()=>{
    console.log(
        "hey port on 3001"
    )
})