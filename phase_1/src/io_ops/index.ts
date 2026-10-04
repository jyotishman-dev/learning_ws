

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



  });
}