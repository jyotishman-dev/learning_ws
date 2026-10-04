"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Socket_Connector() {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState("Disconnected");
  const [brName, setBrName] = useState("");

  useEffect(() => {

    const newSocket = io("http://localhost:4001");

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);

      setSocket(newSocket);
      setStatus(`Connected: ${newSocket.id}`);
    });

    newSocket.on("user-joined", (data) => {
      console.log("Someone joined:", data.name);

      setBrName(data.name);
    });

    newSocket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    return () => {
      newSocket.disconnect();
    };

  }, []);


  const joinHandler = () => {

    if (!socket) return;

    socket.emit("hello", {
      name: "Jyotishman",
    });

  };


  return (
    <main>

      <h1>SOCKET IO CLIENT</h1>

      <p>{status}</p>

      <button onClick={joinHandler}>
        Join
      </button>

      <p>
        The user {brName} has joined
      </p>

    </main>
  );
}