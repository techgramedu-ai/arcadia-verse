import { useState } from "react";
import { 
  Search, 
  Edit, 
  MoreVertical, 
  Phone, 
  Video, 
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  Sparkles,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
}

const chats: Chat[] = [
  {
    id: "1",
    name: "JEE Study Group",
    avatar: "J",
    lastMessage: "Priya: Just solved the integration problem!",
    time: "2m",
    unread: 5,
    online: true,
  },
  {
    id: "2",
    name: "Amit Kumar",
    avatar: "A",
    lastMessage: "Thanks for the Physics notes! 🙏",
    time: "15m",
    unread: 0,
    online: true,
    typing: true,
  },
  {
    id: "3",
    name: "NEET Bio Discussion",
    avatar: "N",
    lastMessage: "Dr. Sharma: Tomorrow's class at 6 PM",
    time: "1h",
    unread: 12,
    online: false,
  },
  {
    id: "4",
    name: "Sarah Chen",
    avatar: "S",
    lastMessage: "GRE prep going well?",
    time: "3h",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Kota Friends",
    avatar: "K",
    lastMessage: "Meetup tomorrow at 7?",
    time: "5h",
    unread: 3,
    online: true,
  },
];

const messages = [
  { id: "1", sender: "other", name: "Amit Kumar", text: "Hey! Did you solve the thermodynamics problem?", time: "10:30 AM" },
  { id: "2", sender: "me", text: "Yes! It was tricky but I got it", time: "10:32 AM", status: "read" },
  { id: "3", sender: "other", name: "Amit Kumar", text: "Can you share your approach? I'm stuck at the entropy calculation", time: "10:33 AM" },
  { id: "4", sender: "me", text: "Sure! Let me send you my notes", time: "10:35 AM", status: "read" },
  { id: "5", sender: "me", text: "The key is to consider the reversible process first, then apply ΔS = Q/T", time: "10:36 AM", status: "delivered" },
];

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
  "from-cosmic-gold to-cosmic-pink",
  "from-cosmic-green to-cosmic-cyan",
];

export const MessagesSection = () => {
  const [selectedChat, setSelectedChat] = useState(chats[1]);
  const [message, setMessage] = useState("");

  return (
    <div className="h-screen flex flex-col">
      <TopBar title="Messages" subtitle="Stay connected with your network" />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-80 glass-strong border-r border-border/50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">Chats</h2>
              <Button variant="ghost" size="icon">
                <Edit size={18} />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-cosmic">
            {chats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/30",
                  selectedChat.id === chat.id && "bg-muted/50"
                )}
              >
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br",
                    avatarColors[index % avatarColors.length]
                  )}>
                    <span className="text-primary-foreground">{chat.avatar}</span>
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-cosmic-green rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate",
                      chat.typing ? "text-primary" : "text-muted-foreground"
                    )}>
                      {chat.typing ? "typing..." : chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 glass-strong border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gradient-to-br",
                  avatarColors[1]
                )}>
                  <span className="text-primary-foreground">{selectedChat.avatar}</span>
                </div>
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cosmic-green rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedChat.name}</p>
                <p className="text-xs text-cosmic-green">
                  {selectedChat.typing ? "typing..." : selectedChat.online ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="glass" size="icon">
                <Phone size={18} />
              </Button>
              <Button variant="glass" size="icon">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-cosmic p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl p-3",
                    msg.sender === "me"
                      ? "bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta text-primary-foreground rounded-br-none"
                      : "glass rounded-bl-none"
                  )}
                >
                  {msg.sender === "other" && (
                    <p className="text-xs font-semibold mb-1 text-primary">{msg.name}</p>
                  )}
                  <p className={cn(
                    "text-sm",
                    msg.sender === "me" ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {msg.text}
                  </p>
                  <div className={cn(
                    "flex items-center justify-end gap-1 mt-1",
                    msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    <span className="text-[10px]">{msg.time}</span>
                    {msg.sender === "me" && (
                      msg.status === "read" ? (
                        <CheckCheck size={12} className="text-primary-foreground" />
                      ) : (
                        <Check size={12} />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 glass-strong border-t border-border/50">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Paperclip size={18} />
              </Button>
              <Button variant="ghost" size="icon">
                <Image size={18} />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow-sm transition-all pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Sparkles size={16} className="text-primary" />
                  </Button>
                </div>
              </div>
              {message ? (
                <Button variant="cosmic" size="icon">
                  <Send size={18} />
                </Button>
              ) : (
                <Button variant="glass" size="icon">
                  <Mic size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
