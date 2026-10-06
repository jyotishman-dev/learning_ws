"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const s = getSocket(token);

    const onConnect = () => {
      console.log("Connected:", s.id);
      setConnected(true);
      setError(null);
    };
    const onDisconnect = () => {
      console.log("Disconnected");
      setConnected(false);
    };
    const onError = (err: Error) => {
      console.error("Socket error:", err.message);
      setError(err.message);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onError);

    setSocket(s);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onError);
      disconnectSocket();
    };
  }, [token]);

  return { socket, connected, error };
}