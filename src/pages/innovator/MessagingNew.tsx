import { useState, useEffect } from "react";
import { ChevronLeft, Send, Search, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { FriendRequests } from "@/components/innovator/messaging/FriendRequests";
import { TeamInvitations } from "@/components/innovator/messaging/TeamInvitations";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
interface Thread {
  id: string;
  created_at: string;
  otherUser: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  };
  lastMessage?: Message;
}
export default function MessagingNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("thread");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadThreads();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (threadId) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setActiveThread(thread);
        loadMessages(threadId);
      }
    }
  }, [threadId, threads]);
  useEffect(() => {
    if (activeThread) {
      const channel = supabase.channel(`messages:${activeThread.id}`).on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${activeThread.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeThread]);
  const loadThreads = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // Get threads user participates in
      const {
        data: participations,
        error: partError
      } = await supabase.from('thread_participants').select('thread_id').eq('user_id', user.id);
      if (partError) throw partError;
      const threadIds = participations?.map(p => p.thread_id) || [];
      if (threadIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get other participants for each thread
      const threadsData: Thread[] = [];
      for (const tid of threadIds) {
        const {
          data: otherParticipant
        } = await supabase.from('thread_participants').select('user_id, profiles(id, full_name, avatar_url, email)').eq('thread_id', tid).neq('user_id', user.id).single();
        if (otherParticipant) {
          const {
            data: lastMsg
          } = await supabase.from('messages').select('*').eq('thread_id', tid).order('created_at', {
            ascending: false
          }).limit(1).single();
          threadsData.push({
            id: tid,
            created_at: new Date().toISOString(),
            otherUser: otherParticipant.profiles as any,
            lastMessage: lastMsg || undefined
          });
        }
      }
      setThreads(threadsData.sort((a, b) => new Date(b.lastMessage?.created_at || b.created_at).getTime() - new Date(a.lastMessage?.created_at || a.created_at).getTime()));
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadMessages = async (tid: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('messages').select('*').eq('thread_id', tid).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread || !currentUserId) return;
    try {
      const {
        error
      } = await supabase.from('messages').insert({
        thread_id: activeThread.id,
        sender_id: currentUserId,
        content: newMessage.trim()
      });
      if (error) throw error;
      setNewMessage("");
      loadThreads();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };
  const filteredThreads = threads.filter(thread => thread.otherUser.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Threads list view
  if (!activeThread) {
    return <div className="min-h-screen bg-background pb-20">
        <FishtankHeader title="Messages" showLogo={false} showProfile={true} />
        
        <div className="section-padding pt-4 space-y-4 py-0">
          <TeamInvitations />
          <FriendRequests onRequestHandled={loadThreads} />
        </div>
        
        {/* Search Bar */}
        <div className="sticky top-14 z-30 bg-background border-b border-border py-px my-0 mx-0 px-[17px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/30 border-none mx-0 px-[41px] py-[4px] my-px" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-border">
          {filteredThreads.length === 0 && !loading ? <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Conversations</h2>
                <p className="text-muted-foreground mb-4">Connect with people to start messaging</p>
                <Button onClick={() => navigate("/network")}>Explore Network</Button>
              </div>
            </div> : filteredThreads.map(thread => <button key={thread.id} onClick={() => {
          setActiveThread(thread);
          loadMessages(thread.id);
        }} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 active:bg-muted transition-colors text-left">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={thread.otherUser.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {thread.otherUser.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {thread.otherUser.full_name || thread.otherUser.email}
                    </h3>
                    {thread.lastMessage && <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDistanceToNow(new Date(thread.lastMessage.created_at), {
                  addSuffix: true
                })}
                      </span>}
                  </div>
                  
                  {thread.lastMessage ? <p className="text-sm text-muted-foreground truncate">
                      {thread.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                      {thread.lastMessage.content}
                    </p> : <p className="text-sm text-muted-foreground italic">
                      Start a conversation with {thread.otherUser.full_name?.split(' ')[0] || thread.otherUser.email?.split('@')[0] || 'them'}
                    </p>}
                </div>
              </button>)}
        </div>
      </div>;
  }

  // Chat view
  return <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveThread(null)} className="flex-shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <button onClick={() => navigate(`/user/${activeThread.otherUser.id}`)} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={activeThread.otherUser.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {activeThread.otherUser.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-sm truncate">
                  {activeThread.otherUser.full_name || activeThread.otherUser.email}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-muted/20 px-4 py-6 space-y-3">
        {messages.length === 0 ? <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={activeThread.otherUser.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-2xl">
                  {activeThread.otherUser.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold mb-1">{activeThread.otherUser.full_name || activeThread.otherUser.email}</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation with {activeThread.otherUser.full_name?.split(' ')[0] || activeThread.otherUser.email?.split('@')[0] || 'them'}
              </p>
            </div>
          </div> : messages.map(message => <div key={message.id} className={cn("flex", message.sender_id === currentUserId ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[75%] px-3 py-2 rounded-2xl shadow-sm", message.sender_id === currentUserId ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-background border border-border rounded-bl-sm")}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className={cn("text-xs block text-right mt-1", message.sender_id === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
              </span>
            </div>
          </div>)}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-muted/50 rounded-3xl px-4 py-2 border border-border">
            <Input placeholder="Message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }} className="border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <Button onClick={sendMessage} disabled={!newMessage.trim()} size="icon" className="rounded-full flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>;
}