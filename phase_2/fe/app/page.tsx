"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type Message = {
  socketId: string
  message: string
}

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const socket = io("http://localhost:3001")

   socket.on("connect", () => {
  console.log("CLIENT SOCKET ID:", socket.id)
  setSocket(socket)
})

  socket.on("message", (data: Message) => {
  console.log("MESSAGE RECEIVED BY CLIENT:", data)

  setChatMessages((prev) => [...prev, data])
})

    return () => {
      socket.disconnect()
    }
  }, [])

  const messageHandler = (e: React.FormEvent) => {
    e.preventDefault()

    if (!socket || !message.trim()) return

    socket.emit("message", {
      message
    })

    setMessage("")
  }

  return (
    <>
      <form onSubmit={messageHandler}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message..."
        />

        <button type="submit">
          Send
        </button>
      </form>

      <div>
        {chatMessages.map((chat, index) => (
          <div key={index}>
            <strong>{chat.socketId}</strong>: {chat.message}
          </div>
        ))}
      </div>
    </>
  )
}

export default Home