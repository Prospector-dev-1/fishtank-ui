import { useState } from 'react';
import { ArrowLeft, Send, MoreVertical, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/investor/ui/card';
import { Button } from '@/components/investor/ui/button';
import { Input } from '@/components/investor/ui/input';
import { mockMessages, mockConversations } from "@/data/investor/mockData";
import { cn } from "@/lib/investor/utils";
import { FilterTabs, FilterType } from "@/components/investor/FilterTabs";
export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const selectedMessage = mockMessages.find(msg => msg.id === selectedChat);
  const chatMessages = selectedChat ? mockConversations[selectedChat as keyof typeof mockConversations] || [] : [];

  // Filter messages based on active filter
  const filteredMessages = mockMessages.filter(message => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'messages') return message.type === 'direct';
    if (activeFilter === 'teams') return message.type === 'team';
    if (activeFilter === 'system') return message.type === 'system';
    return true;
  });
  const quickReplies = ["Thanks for reaching out!", "I'd like to schedule a call", "Can you send more details?", "What's your current runway?", "Impressive traction!"];
  if (selectedChat) {
    return <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center relative">
              <span className="text-sm font-semibold">
                {selectedMessage?.founder.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
              </span>
              {selectedMessage?.isGroupChat && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-secondary-foreground text-xs">👥</span>
                </div>}
            </div>
            <div>
              <h2 className="font-semibold">
                {selectedMessage?.isGroupChat ? selectedMessage?.startup : selectedMessage?.founder || 'Unknown User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedMessage?.isGroupChat ? selectedMessage?.founder : `${selectedMessage?.startup || 'Unknown Startup'} • Online`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatMessages.map(message => <div key={message.id} className={cn('flex', message.isMe ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-xs px-4 py-2 rounded-2xl', message.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}>
                {!message.isMe && selectedMessage?.isGroupChat && <p className="text-xs font-medium mb-1 opacity-70">
                    {message.sender}
                  </p>}
                <p className="text-sm">{message.content}</p>
                <p className={cn('text-xs mt-1', message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {message.timestamp}
                </p>
              </div>
            </div>)}
        </div>

        {/* Quick Replies */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2 overflow-x-auto pb-3">
            {quickReplies.map((reply, index) => <Button key={index} variant="outline" size="sm" className="whitespace-nowrap" onClick={() => setMessageText(reply)}>
                {reply}
              </Button>)}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex space-x-2">
            <Input placeholder="Type a message..." value={messageText} onChange={e => setMessageText(e.target.value)} onKeyPress={e => {
            if (e.key === 'Enter') {
              // In a real app, send message here
              setMessageText('');
            }
          }} className="flex-1" />
            <Button size="sm" disabled={!messageText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background pb-20">
      <div className="container-safe space-y-6 py-[3px]">
        <h1 className="text-h1 font-bold">Inbox</h1>
        
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2" />

        <div className="space-y-3">
          {filteredMessages.map(message => <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => setSelectedChat(message.id)}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0 flex items-center justify-center relative">
                    {message.type === 'system' ? <Bell className="w-6 h-6 text-primary" /> : <span className="text-sm font-semibold">
                        {message.founder.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>}
                    {message.isGroupChat && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-secondary-foreground text-xs">👥</span>
                      </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{message.startup}</h3>
                      <div className="flex items-center space-x-2">
                        {message.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.isGroupChat ? message.founder : message.founder}
                    </p>
                    <p className="text-sm truncate mt-1">
                      {message.lastMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {filteredMessages.length === 0 && <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-h2 font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Start conversations with founders from your portfolio
              </p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}