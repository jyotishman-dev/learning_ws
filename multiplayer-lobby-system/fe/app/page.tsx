"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USERS = [
  { token: "token-alice", name: "Alice" },
  { token: "token-bob", name: "Bob" },
  { token: "token-carol", name: "Carol" },
];

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const login = () => {
    if (!token) return;
    localStorage.setItem("token", token);
    router.push("/lobby");
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Login as…</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {USERS.map((u) => (
          <button
            key={u.token}
            onClick={() => setToken(u.token)}
            style={{
              padding: "8px 16px",
              background: token === u.token ? "#333" : "#eee",
              color: token === u.token ? "#fff" : "#333",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {u.name}
          </button>
        ))}
      </div>
      <button onClick={login} disabled={!token}>
        Enter Lobby
      </button>
    </div>
  );
}