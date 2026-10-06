"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import type {
  LobbySnapshot,
  OnlineUser,
  ChatMessage,
  DMMessage,
} from "@/lib/types";

export function useLobby(socket: Socket | null) {
  const [lobby, setLobby] = useState<LobbySnapshot | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [dmMessages, setDmMessages] = useState<DMMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<
    Record<string, string>
  >({}); // socketId -> username
  const [error, setError] = useState<string | null>(null);

  // typing timeouts
  const typingTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (!socket) return;

    // ── Lobby state ──
    const onLobbyUpdated = (data: LobbySnapshot) => setLobby(data);
    const onUserJoined = (data: { username: string }) => {
      pushSystemMessage(`${data.username} joined`);
    };
    const onUserLeft = (data: { username: string }) => {
      pushSystemMessage(`${data.username} left`);
    };

    // ── Online users ──
    const onOnlineUsers = (data: OnlineUser[]) => setOnlineUsers(data);

    // ── Chat ──
    const onMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    // ── DM ──
    const onDM = (data: DMMessage) => {
      setDmMessages((prev) => [...prev, data]);
    };

    // ── Typing ──
    const onTyping = (data: { socketId: string; username: string }) => {
      setTypingUsers((prev) => ({ ...prev, [data.socketId]: data.username }));

      // pehle ka timeout clear karo
      if (typingTimers.current[data.socketId]) {
        clearTimeout(typingTimers.current[data.socketId]);
      }

      // 1.5 sec baad hatao
      typingTimers.current[data.socketId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[data.socketId];
          return copy;
        });
      }, 1500);
    };

    // ── Error ──
    const onError = (msg: string) => setError(msg);

    // ── Game events ──
    const onGameStarted = () => {
      pushSystemMessage("🎮 Game started!");
    };

    // register
    socket.on("lobby:updated", onLobbyUpdated);
    socket.on("lobby:user-joined", onUserJoined);
    socket.on("lobby:user-left", onUserLeft);
    socket.on("online-users", onOnlineUsers);
    socket.on("lobby:message", onMessage);
    socket.on("dm-received", onDM);
    socket.on("user-typing", onTyping);
    socket.on("error", onError);
    socket.on("game:started", onGameStarted);

    return () => {
      socket.off("lobby:updated", onLobbyUpdated);
      socket.off("lobby:user-joined", onUserJoined);
      socket.off("lobby:user-left", onUserLeft);
      socket.off("online-users", onOnlineUsers);
      socket.off("lobby:message", onMessage);
      socket.off("dm-received", onDM);
      socket.off("user-typing", onTyping);
      socket.off("error", onError);
      socket.off("game:started", onGameStarted);
    };
  }, [socket]);

  function pushSystemMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        socketId: "system",
        username: "system",
        message: text,
        sentAt: Date.now(),
      },
    ]);
  }

  // ── Actions ──
  const joinLobby = (lobbyId: string) => socket?.emit("lobby:join", lobbyId);
  const toggleReady = () => {
    if (!lobby) return;
    const me = lobby.players.find((p) => p.socketId === socket?.id);
    socket?.emit("lobby:ready", !me?.ready);
  };
  const startGame = () => socket?.emit("lobby:start");
  const sendMessage = (message: string) => {
    if (!lobby) return;
    socket?.emit("lobby:message", { lobbyId: lobby.id, message });
  };
  const sendDM = (to: string, message: string) =>
    socket?.emit("dm", { to, message });
  const notifyTyping = () => {
    if (!lobby) return;
    socket?.emit("typing", lobby.id);
  };

  return {
    lobby,
    onlineUsers,
    messages,
    dmMessages,
    typingUsers,
    error,
    joinLobby,
    toggleReady,
    startGame,
    sendMessage,
    sendDM,
    notifyTyping,
  };
}