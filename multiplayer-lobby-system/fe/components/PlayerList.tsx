"use client";

import type { LobbySnapshot } from "@/lib/types";

interface Props {
  lobby: LobbySnapshot | null;
  mySocketId?: string;
  onReady: () => void;
  onStart: () => void;
}

export default function PlayerList({
  lobby,
  mySocketId,
  onReady,
  onStart,
}: Props) {
  if (!lobby) return <p>Not in a lobby</p>;

  const me = lobby.players.find((p) => p.socketId === mySocketId);
  const isHost = lobby.hostSocketId === mySocketId;

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
      <h3>
        Players ({lobby.players.length}/{lobby.maxPlayers}) — {lobby.state}
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lobby.players.map((p) => (
          <li key={p.socketId} style={{ padding: "4px 0" }}>
            {p.username}
            {p.socketId === lobby.hostSocketId && " 👑"}
            {p.socketId === mySocketId && " (you)"}
            {p.ready && " ✅"}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onReady}>
          {me?.ready ? "Unready" : "Ready"}
        </button>
        {isHost && (
          <button
            onClick={onStart}
            disabled={lobby.state !== "waiting"}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}