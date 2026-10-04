import type { Server } from "socket.io";


export async function  Server_Operations(io: Server) {
    io.on("connect", (user)=>{

        console.log( `User is connected : ${user.id}`)


        user.on('join-room', (roomName)=>{
            user.join(roomName);
            user.to(roomName).emit(`user-joined-room`, { id : user.id })
        });

        user.on('room-message',({room , message})=>{
            io.to(room).emit('new-message',{ message , from : user.id})
        });

        

    })
}