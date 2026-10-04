"use client"

import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

const Home = () => {
  
  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      // join karo
      socket.emit("join-room", "general");

      // message bhejo (thoda delay ke saath, ya join ke andar)
      setTimeout(() => {
        socket.emit("room-message", { room: "general", message: "hi bro" });
      }, 500);
    });

    socket.on('new-message', (data) => {
      console.log(data.from, ":", data.message);
    });

    socket.on("user-joined-room", (data) => {
      console.log(data.id, "joined the room");
    });

    // ✅ CLEANUP — bahut important
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };

  }, []);

  return <div>Home</div>
}

export default Home