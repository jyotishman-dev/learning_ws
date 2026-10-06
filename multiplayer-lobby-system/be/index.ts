import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerLobbyNamespace } from "./src/lobby/ws";
import { authMiddleware } from "./src/middlewares/auth";


const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ═══ Task 11: auth middleware — har namespace pe apply ═══
io.use(authMiddleware);

// ═══ Task 10: namespaces ═══
const lobbyNs = io.of("/lobby");
registerLobbyNamespace(lobbyNs);

lobbyNs.use(authMiddleware)

server.listen(3001, () => {
  console.log("Server listening on 3001");
});