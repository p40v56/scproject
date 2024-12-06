import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isAdmin: boolean
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Support",
      content: "Bonjour, comment puis-je vous aider ?",
      timestamp: "10:00",
      isAdmin: true,
    },
    {
      id: 2,
      sender: "Vous",
      content: "J'ai une question concernant mon étude",
      timestamp: "10:05",
      isAdmin: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "Vous",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isAdmin: false,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <Card className="flex-1">
        <ScrollArea className="h-[calc(100vh-16rem)] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 ${
                message.isAdmin ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Avatar>
                <AvatarImage src={message.isAdmin ? "/admin-avatar.png" : "/user-avatar.png"} />
                <AvatarFallback>{message.isAdmin ? "S" : "V"}</AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.isAdmin
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <div className="font-semibold mb-1">{message.sender}</div>
                <div>{message.content}</div>
                <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <CardContent className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Messages