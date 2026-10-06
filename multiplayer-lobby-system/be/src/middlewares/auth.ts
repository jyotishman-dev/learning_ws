import type { Socket } from "socket.io";
import type { UserPayload } from "../types.js";

const TOKENS: Record<string, UserPayload> = {
  "token-alice": { userId: "u1", username: "Alice" },
  "token-bob":   { userId: "u2", username: "Bob" },
  "token-carol": { userId: "u3", username: "Carol" },
};

export function authMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token as string | undefined;

  if (!token) {
    return next(new Error("No token provided"));
  }

  const user = TOKENS[token];
  if (!user) {
    return next(new Error("Invalid token"));
  }

  // socket.data me attach karo — poore connection ke liye milega
  socket.data.user = user;
  next();
}