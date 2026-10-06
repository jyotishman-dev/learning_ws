"use client";

import type { DMMessage } from "@/lib/types";

interface Props {
  dmMessages: DMMessage[];
}

export default function DMBox({ dmMessages }: Props) {
  if (dmMessages.length === 0) return null;

  return (
    <div
      style={{
        border: "1px solid #f0ad4e",
        background: "#fff8e7",
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 8px" }}>💬 Private Messages</h4>
      {dmMessages.map((d, i) => (
        <div key={i} style={{ fontSize: 13, padding: "2px 0" }}>
          <strong>{d.fromName}</strong>: {d.message}
        </div>
      ))}
    </div>
  );
}