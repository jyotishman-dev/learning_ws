"use client";

interface Props {
  typingUsers: Record<string, string>;
}

export default function TypingIndicator({ typingUsers }: Props) {
  const names = Object.values(typingUsers);
  if (names.length === 0) return <div style={{ height: 20 }} />;

  const text =
    names.length === 1
      ? `${names[0]} is typing…`
      : `${names.join(", ")} are typing…`;

  return (
    <div
      style={{
        height: 20,
        fontStyle: "italic",
        color: "#666",
        fontSize: 14,
      }}
    >
      {text}
    </div>
  );
}