"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Socket_Connector() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    console.log("Creating socket...");

    const newSocket = io("http://localhost:4001");

    newSocket.on("connect", () => {
      console.log("Connected", newSocket.id);

      setStatus(`Connected: ${newSocket.id}`);
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected");

      setStatus("Disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  const messageHandler = () =>{
    const messageId = socket
    const message = `My name is Jyotishman pathak lets omit this event`

    if(socket) {
        socket.emit(`message:${socket.id}`, message);
    }else{
        null
    }
  }


  return (
    <main>
      <h1>SOCKET IO CLIENT</h1>
        <button onClick={messageHandler}> Click for message </button>
      <p>{status}</p>
    </main>
  );
}