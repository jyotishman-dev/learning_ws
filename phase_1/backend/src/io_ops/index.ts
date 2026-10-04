

import type { Server } from "socket.io";

export function socketHandler(io: Server) {
  console.log("Socket handler registered");

  io.on("connection", (socket) => {
    console.log(" USER CONNECTED:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ USER DISCONNECTED:", socket.id);
    });


    socket.on(`message:${socket.id}`,(message)=>{
        console.log(`message received ${message}`)
    })


   socket.emit('welcome', {message : "Welcome to the server chad!!!"})

    socket.on('welcome:mess', (m)=>{
        console.log(m)
    })



    socket.on('hello',(data)=>{
        console.log(`user joined  ${data.name}`)
        socket.broadcast.emit('user-joined', data)
    })

  });
}