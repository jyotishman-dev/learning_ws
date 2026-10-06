import type { Namespace, Socket } from "socket.io";
import { lobbies, onlineUser,  } from "../state.js";
import { checkRateLimit, clearRateLimit } from "../utils/rateLimit.js";
import type { Lobby, Player, UserPayload } from "../types.js";

export function registerLobbyNamespace(nsp: Namespace) {
  nsp.on("connection", (socket: Socket) => {
  
    const user = socket.data.user as UserPayload;
    console.log(`[lobby] ${user.username} connected (${socket.id})`);


    const player: Player = {
      socketId: socket.id,
      userId: user.userId,
      userName: user.username,
      ready: false,
      score: 0,
      joinedAt: Date.now(),
    };
    onlineUser.set(socket.id, player);

  
    broadcastOnlineUsers(nsp);


    socket.on("lobby:join", (lobbyId: string) => {
      if (!checkRateLimit(socket.id, 5, 2000)) {
        return socket.emit("error", "Slow down!");
      }

      let lobby = lobbies.get(lobbyId);

     
      if (!lobby) {
        lobby = {
          id: lobbyId,
          hostSocketId: socket.id,
          players: new Map(),
          state: "waiting",
          createdAt: Date.now(),
          maxPlayers: 8,
        };
        lobbies.set(lobbyId, lobby);
        console.log(`[lobby] ${lobbyId} created by ${user.username}`);
      }

      if (lobby.players.size >= lobby.maxPlayers) {
        return socket.emit("error", "Lobby full");
      }


      lobby.players.set(socket.id, player);
      socket.join(lobbyId); 

   
      nsp.to(lobbyId).emit("lobby:updated", serializeLobby(lobby));


      socket.to(lobbyId).emit("lobby:user-joined", {
        socketId: socket.id,
        username: user.username,
      });
    });


    socket.on("lobby:ready", (ready: boolean) => {
      const lobby = findLobbyBySocket(socket.id);
      if (!lobby) return;

      const p = lobby.players.get(socket.id);
      if (p) p.ready = ready;

      nsp.to(lobby.id).emit("lobby:updated", serializeLobby(lobby));
    });


    socket.on("lobby:start", () => {
      const lobby = findLobbyBySocket(socket.id);
      if (!lobby) return;

      if (lobby.hostSocketId !== socket.id) {
        return socket.emit("error", "Only host can start");
      }

      const allReady = [...lobby.players.values()].every((p) => p.ready);
      if (!allReady) {
        return socket.emit("error", "Not everyone is ready");
      }

      lobby.state = "playing";
      nsp.to(lobby.id).emit("lobby:updated", serializeLobby(lobby));
      nsp.to(lobby.id).emit("game:started");
    });

    
   
    socket.on("typing", (lobbyId: string) => {
    
      socket.to(lobbyId).emit("user-typing", {
        socketId: socket.id,
        username: user.username,
      });
    });


    socket.on(
      "dm",
      ({ to, message }: { to: string; message: string }) => {
        if (!checkRateLimit(socket.id, 5, 1000)) {
          return socket.emit("error", "Slow down on DMs!");
        }

     
        nsp.to(to).emit("dm-received", {
          from: socket.id,
          fromName: user.username,
          message,
          sentAt: Date.now(),
        });
      }
    );


    socket.on(
      "lobby:message",
      ({ lobbyId, message }: { lobbyId: string; message: string }) => {
        if (!checkRateLimit(socket.id, 5, 2000)) {
          return socket.emit("error", "Slow down!");
        }

        nsp.to(lobbyId).emit("lobby:message", {
          socketId: socket.id,
          username: user.username,
          message,
          sentAt: Date.now(),
        });
      }
    );


    socket.on("disconnect", () => {
      console.log(`[lobby] ${user.username} disconnected`);

     
      onlineUser.delete(socket.id);
      clearRateLimit(socket.id);
      broadcastOnlineUsers(nsp);

   
      const lobby = findLobbyBySocket(socket.id);
      if (!lobby) return;

      lobby.players.delete(socket.id);

   
      if (lobby.players.size === 0) {
        lobbies.delete(lobby.id);
        console.log(`[lobby] ${lobby.id} deleted (empty)`);
        return;
      }

     
      if (lobby.hostSocketId === socket.id) {
        const newHost = lobby.players.keys().next().value;
        if (newHost) lobby.hostSocketId = newHost;
      }

      nsp.to(lobby.id).emit("lobby:updated", serializeLobby(lobby));
      nsp.to(lobby.id).emit("lobby:user-left", {
        socketId: socket.id,
        username: user.username,
      });
    });
  });
}


function broadcastOnlineUsers(nsp: Namespace) {
  const list = [...onlineUser.values()].map((p) => ({
    socketId: p.socketId,
    username: p.userName,
  }));
  nsp.emit("online-users", list);
}

function findLobbyBySocket(socketId: string): Lobby | undefined {
  for (const lobby of lobbies.values()) {
    if (lobby.players.has(socketId)) return lobby;
  }
  return undefined;
}

function serializeLobby(lobby: Lobby) {
  return {
    id: lobby.id,
    hostSocketId: lobby.hostSocketId,
    state: lobby.state,
    maxPlayers: lobby.maxPlayers,
    players: [...lobby.players.values()],
  };
}