import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Send, Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import type { ChatThread } from "@/lib/types";
import { IOSHeader } from "@/components/ui/ios-header";
import { IOSInput } from "@/components/ui/ios-input";
import { IOSButton } from "@/components/ui/ios-button";
import { IOSList, IOSListItem, IOSListSection } from "@/components/ui/ios-list";
import { IOSCard } from "@/components/ui/ios-card";
import { IOSBadge } from "@/components/ui/ios-badge";
import { IOSEmptyState } from "@/components/ui/ios-empty-state";
import { IOSSkeleton } from "@/components/ui/ios-skeleton";
import CreateTeamModal from "@/components/CreateTeamModal";
import { cn } from "@/lib/utils";

export default function Inbox() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hideNavigation, showNavigation } = useNavigation();
  const { user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [teamMessages, setTeamMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"messages" | "teams">("messages");

  useEffect(() => {
    if (user) {
      loadMessages();
      loadPendingRequests();
      loadTeams();
    }
  }, [user]);

  useEffect(() => {
    const state = location.state as { selectedUserId?: string };
    if (state?.selectedUserId) {
      const thread = chatThreads.find(t => t.id === state.selectedUserId);
      if (thread) {
        setSelectedThread(thread);
      }
    }
  }, [location.state, chatThreads]);

  useEffect(() => {
    if (selectedThread || selectedTeam) {
      hideNavigation();
    } else {
      showNavigation();
    }
    
    return () => showNavigation();
  }, [selectedThread, selectedTeam, hideNavigation, showNavigation]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationMap = new Map<string, ChatThread>();

      for (const msg of messages || []) {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', otherUserId)
            .single();

          conversationMap.set(otherUserId, {
            id: otherUserId,
            type: 'message' as const,
            participantName: profile?.full_name || 'Unknown',
            participantAvatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
            projectTitle: '',
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: !msg.read && msg.recipient_id === user.id ? 1 : 0,
            status: 'active' as const,
            messages: [],
          });
        }
      }

      setChatThreads(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('to_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (req) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', req.from_user_id)
            .single();

          return {
            ...req,
            name: profile?.full_name || 'Unknown',
            avatarUrl: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.from_user_id}`,
          };
        })
      );

      setPendingRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const loadTeams = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${threadId},recipient_id.eq.${threadId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setThreadMessages(data || []);
    } catch (error) {
      console.error('Error loading thread messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedThread) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedThread.id,
          content: newMessage.trim(),
        });

      if (error) throw error;
      
      setNewMessage("");
      loadThreadMessages(selectedThread.id);
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      loadPendingRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const filteredThreads = chatThreads.filter(thread =>
    thread.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedThread) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <div className="ios-frosted border-b border-border/30 safe-top">
          <div className="flex items-center gap-3 h-14 px-4 max-w-2xl mx-auto">
            <button
              onClick={() => {
                setSelectedThread(null);
                setThreadMessages([]);
              }}
              className="touch-target flex items-center text-primary active:opacity-60 transition-opacity duration-120 -ml-2"
            >
              <ArrowLeft className="h-5 w-5 mr-1" strokeWidth={2} />
              <span className="text-body font-normal">Back</span>
            </button>
            
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-footnote font-semibold text-primary">
                  {selectedThread.participantName[0]}
                </span>
              </div>
              <span className="text-body font-semibold truncate">
                {selectedThread.participantName}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {threadMessages.map((msg, idx) => {
            const isOwn = msg.sender_id === user?.id;
            return (
              <div
                key={idx}
                className={cn(
                  "flex",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-body whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="ios-frosted border-t border-border/30 p-4 safe-bottom">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <IOSInput
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <IOSButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="h-5 w-5" />
            </IOSButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <IOSHeader 
        largeTitle="Inbox"
        rightAction={
          <button
            onClick={() => setIsCreateTeamOpen(true)}
            className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120"
          >
            <Plus className="h-6 w-6" strokeWidth={2} />
          </button>
        }
      />

      {/* Segmented Control */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "messages"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "teams"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {activeTab === "messages" ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <IOSInput
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 rounded-full"
              />
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <IOSListSection title="Connection Requests">
                <IOSList inset>
                  {pendingRequests.map(req => (
                    <div key={req.id} className="ios-list-cell p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-subhead font-semibold text-primary">
                            {req.name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body font-semibold truncate">{req.name}</p>
                          <p className="text-subhead text-muted-foreground">Wants to connect</p>
                        </div>
                        <IOSButton
                          size="sm"
                          onClick={() => handleAcceptRequest(req.id)}
                        >
                          Accept
                        </IOSButton>
                      </div>
                    </div>
                  ))}
                </IOSList>
              </IOSListSection>
            )}

            {/* Conversations */}
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <IOSCard key={i} className="p-4">
                    <div className="flex gap-3">
                      <IOSSkeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <IOSSkeleton className="h-4 w-1/2" />
                        <IOSSkeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  </IOSCard>
                ))}
              </div>
            ) : filteredThreads.length === 0 ? (
              <IOSEmptyState
                icon={<Users className="h-12 w-12" />}
                title={searchQuery ? "No conversations found" : "No messages yet"}
                description={searchQuery ? "Try a different search term" : "Start connecting with creators"}
                action={
                  !searchQuery
                    ? {
                        label: "Discover Creators",
                        onClick: () => navigate("/network"),
                      }
                    : undefined
                }
              />
            ) : (
              <IOSList inset>
                {filteredThreads.map(thread => (
                  <IOSListItem
                    key={thread.id}
                    title={thread.participantName}
                    subtitle={thread.lastMessage}
                    onClick={() => {
                      setSelectedThread(thread);
                      loadThreadMessages(thread.id);
                    }}
                    trailing={
                      thread.unreadCount > 0 && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )
                    }
                    chevron
                    icon={
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-subhead font-semibold text-primary">
                          {thread.participantName[0]}
                        </span>
                      </div>
                    }
                  />
                ))}
              </IOSList>
            )}
          </>
        ) : (
          <>
            {teams.length === 0 ? (
              <IOSEmptyState
                icon={<Users className="h-12 w-12" />}
                title="No teams yet"
                description="Create a team to collaborate with other creators"
                action={{
                  label: "Create Team",
                  onClick: () => setIsCreateTeamOpen(true),
                }}
              />
            ) : (
              <IOSList inset>
                {teams.map(team => (
                  <IOSListItem
                    key={team.id}
                    title={team.name}
                    subtitle={`Created ${new Date(team.created_at).toLocaleDateString()}`}
                    onClick={() => setSelectedTeam(team)}
                    chevron
                    icon={<Users className="h-5 w-5 text-primary" />}
                  />
                ))}
              </IOSList>
            )}
          </>
        )}
      </div>

      <CreateTeamModal
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        availableUsers={chatThreads.map(t => ({
          id: t.id,
          name: t.participantName,
          avatar: t.participantAvatar,
        }))}
        onTeamCreated={() => {
          loadTeams();
          setIsCreateTeamOpen(false);
        }}
      />
    </div>
  );
}