import { useState, useEffect } from "react";
import { ChevronLeft, Send, Paperclip, MoreVertical, Search, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/innovator/ui/button";
import { Card } from "@/components/innovator/ui/card";
import { Input } from "@/components/innovator/ui/input";
import { Avatar, AvatarFallback } from "@/components/innovator/ui/avatar";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/innovator/ui/use-toast";
import { cn } from "@/lib/innovator/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  investorId: string;
  investorName: string;
  investorFirm: string;
  investorAvatar: string;
  messages: Message[];
  lastActivity: string;
}


export default function Messaging() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const investorId = searchParams.get("investor");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    // TODO: Load conversations from database
    loadConversations();
  }, []);

  const loadConversations = async () => {
    // TODO: Implement loading conversations from database
    setConversations([]);
  };

  useEffect(() => {
    if (investorId) {
      const conv = conversations.find(c => c.investorId === investorId);
      if (conv) {
        setActiveConversation(conv);
      } else {
        const newConv: Conversation = {
          id: `conv_${investorId}`,
          investorId,
          investorName: "New Investor",
          investorFirm: "Investment Firm",
          investorAvatar: "NI",
          messages: [],
          lastActivity: new Date().toISOString()
        };
        setConversations([newConv, ...conversations]);
        setActiveConversation(newConv);
      }
    }
  }, [investorId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "user",
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true
    };

    const updatedConv = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
      lastActivity: message.timestamp
    };

    setConversations(prev => 
      prev.map(c => c.id === activeConversation.id ? updatedConv : c)
    );
    setActiveConversation(updatedConv);
    setNewMessage("");

    toast({
      title: "Message Sent",
      description: `Message sent to ${activeConversation.investorName}`
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatTime(timestamp);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessage = (conv: Conversation) => {
    const lastMsg = conv.messages[conv.messages.length - 1];
    if (!lastMsg) return "No messages yet";
    const prefix = lastMsg.senderId === "user" ? "You: " : "";
    return prefix + (lastMsg.text.length > 40 ? lastMsg.text.substring(0, 40) + "..." : lastMsg.text);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.investorFirm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Conversations list view
  if (!activeConversation) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <FishtankHeader title="Messages" showLogo={false} showProfile={true} />
        
        {/* Search Bar */}
        <div className="sticky top-14 z-30 bg-background border-b border-border px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-none"
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {["All", "Requests", "Investors", "Innovators", "Creators", "System"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-border">
          {filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Conversations</h2>
                <p className="text-muted-foreground mb-4">Start messaging investors from the network</p>
                <Button onClick={() => navigate("/network")}>Explore Network</Button>
              </div>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const hasUnread = lastMsg && lastMsg.senderId !== "user" && !lastMsg.read;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 active:bg-muted transition-colors text-left"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {conv.investorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className={cn(
                        "font-semibold text-sm truncate",
                        hasUnread && "text-primary"
                      )}>
                        {conv.investorName}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatRelativeTime(conv.lastActivity)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-sm truncate",
                        hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {getLastMessage(conv)}
                      </p>
                      
                      {lastMsg?.senderId === "user" && (
                        <div className="flex-shrink-0">
                          {lastMsg.read ? (
                            <CheckCheck className="w-4 h-4 text-primary" />
                          ) : (
                            <Check className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      
                      {hasUnread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveConversation(null)}
              className="flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {activeConversation.investorAvatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">
                {activeConversation.investorName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {activeConversation.investorFirm}
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-muted/20" style={{ 
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, hsl(var(--border) / 0.05) 20px, hsl(var(--border) / 0.05) 21px)'
      }}>
        <div className="px-4 py-6 space-y-3">
          {activeConversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.senderId === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] px-3 py-2 rounded-2xl shadow-sm",
                  message.senderId === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-background border border-border rounded-bl-sm"
                )}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={cn(
                      "text-xs",
                      message.senderId === "user" 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                  {message.senderId === "user" && (
                    message.read ? (
                      <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                    ) : (
                      <Check className="w-3 h-3 text-primary-foreground/70" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 bg-muted/50 rounded-3xl px-4 py-2 border border-border">
            <Input
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim()}
            size="icon"
            className="rounded-full flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}