"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";

interface Props {
  messages: ChatMessage[];
  mySocketId?: string;
  onSend: (message: string) => void;
  onTyping: () => void;
}

export default function ChatBox({
  messages,
  mySocketId,
  onSend,
  onTyping,
}: Props) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTyping = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (v: string) => {
    setText(v);
    // debounce — 500ms me ek baar hi bhejo
    const now = Date.now();
    if (now - lastTyping.current > 500) {
      onTyping();
      lastTyping.current = now;
    }
  };

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "2px 0",
              color: m.socketId === "system" ? "#888" : "inherit",
              fontStyle: m.socketId === "system" ? "italic" : "normal",
            }}
          >
            {m.socketId !== "system" && (
              <strong>
                {m.socketId === mySocketId ? "You" : m.username}:{" "}
              </strong>
            )}
            {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", padding: 8, borderTop: "1px solid #ccc" }}>
        <input
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          style={{ flex: 1, padding: 6 }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}