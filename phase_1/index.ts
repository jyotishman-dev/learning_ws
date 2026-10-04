import { configDotenv } from "dotenv";
import app from "./src/app";
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { socketHandler } from "./src/io_ops";

configDotenv()

const server = http.createServer(app)



export const io = new Server(server ,{
    cors : {
         origin: "http://localhost:3000",   
    methods: ["GET", "POST"],
    credentials: true
    }
})


socketHandler(io)



const PORT = 4001;
server.listen(PORT, () => console.log(`ws SERVER is listening on PORT ${PORT}`));