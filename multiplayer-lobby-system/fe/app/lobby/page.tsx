"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useLobby } from "@/hooks/useLobby";

import OnlineUsers from "@/components/OnlineUsers";
import ChatBox from "@/components/ChatBox";
import DMBox from "@/components/DMBox";
import TypingIndicator from "@/components/TypingIndicator";
import PlayerList from "@/components/PlayerList";

export default function LobbyPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [lobbyId, setLobbyId] = useState("game-room-1");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.push("/");
    else setToken(t);
  }, [router]);

  const { socket, connected, error: connError } = useSocket(token);
  const lobby = useLobby(socket);

  const handleJoin = () => {
    lobby.joinLobby(lobbyId);
    setJoined(true);
  };

  if (!token) return <div>Loading…</div>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>
        Lobby — {connected ? "🟢 connected" : "🔴 disconnected"}
      </h2>
      {connError && <p style={{ color: "red" }}>{connError}</p>}

      {!joined && (
        <div style={{ marginBottom: 20 }}>
          <input
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
            placeholder="Lobby ID"
          />
          <button onClick={handleJoin} disabled={!connected}>
            Join Lobby
          </button>
        </div>
      )}

      {joined && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div>
            <PlayerList
              lobby={lobby.lobby}
              mySocketId={socket?.id}
              onReady={lobby.toggleReady}
              onStart={lobby.startGame}
            />
            <OnlineUsers
              users={lobby.onlineUsers}
              mySocketId={socket?.id}
              onSendDM={lobby.sendDM}
            />
            <DMBox dmMessages={lobby.dmMessages} />
          </div>

          <div>
            {lobby.error && (
              <p style={{ color: "orange" }}>{lobby.error}</p>
            )}
            <TypingIndicator typingUsers={lobby.typingUsers} />
            <ChatBox
              messages={lobby.messages}
              mySocketId={socket?.id}
              onSend={lobby.sendMessage}
              onTyping={lobby.notifyTyping}
            />
          </div>
        </div>
      )}
    </div>
  );
}