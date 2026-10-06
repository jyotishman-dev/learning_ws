
export interface Player {
  socketId: string;
  userId: string;
  username: string;
  ready: boolean;
  score: number;
  joinedAt: number;
}

export interface LobbySnapshot {
  id: string;
  hostSocketId: string;
  state: "waiting" | "playing" | "ended";
  maxPlayers: number;
  players: Player[];
}

export interface OnlineUser {
  socketId: string;
  username: string;
}

export interface ChatMessage {
  socketId: string;
  username: string;
  message: string;
  sentAt: number;
}

export interface DMMessage {
  from: string;
  fromName: string;
  message: string;
  sentAt: number;
}