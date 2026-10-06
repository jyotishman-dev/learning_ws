import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (!socket) {
    socket = io("http://localhost:3001/lobby", {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}