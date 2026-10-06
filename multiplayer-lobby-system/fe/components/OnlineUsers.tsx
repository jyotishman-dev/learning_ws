"use client";

import { useState } from "react";
import type { OnlineUser } from "@/lib/types";

interface Props {
  users: OnlineUser[];
  mySocketId?: string;
  onSendDM: (to: string, message: string) => void;
}

export default function OnlineUsers({ users, mySocketId, onSendDM }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [dmText, setDmText] = useState("");

  const send = () => {
    if (!selected || !dmText.trim()) return;
    onSendDM(selected, dmText);
    setDmText("");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      <h3>Online ({users.length})</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li key={u.socketId} style={{ padding: "4px 0" }}>
            {u.username}
            {u.socketId !== mySocketId && (
              <button
                style={{ marginLeft: 8, fontSize: 12 }}
                onClick={() =>
                  setSelected(u.socketId === selected ? null : u.socketId)
                }
              >
                {selected === u.socketId ? "Cancel" : "DM"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
          <input
            value={dmText}
            onChange={(e) => setDmText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="private message"
            style={{ flex: 1 }}
          />
          <button onClick={send}>Send</button>
        </div>
      )}
    </div>
  );
}