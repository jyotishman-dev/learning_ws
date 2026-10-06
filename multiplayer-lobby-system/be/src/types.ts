export interface UserPayload {
    userId : string,
    username : string
}

export interface Player {
    socketId : string,
    userId : string,
    userName : string,
    ready : boolean,
    score : number,
    joinedAt : number
}


export interface Lobby {
  id: string;
  hostSocketId: string;
  players: Map<string, Player>;  
  state: "waiting" | "playing" | "ended";
  createdAt: number;
  maxPlayers: number;
}