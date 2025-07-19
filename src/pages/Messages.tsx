import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Video, Phone, Clock, Mail, Search, ChevronDown, MoreVertical, Smile, Paperclip, Mic, Calendar, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoCallModal from '@/components/VideoCallModal';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  video_call_id?: string;
  video_call_duration?: number;
  created_at: string;
  read_at?: string;
  application_id?: string;
  sender: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  receiver: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  application?: {
    job: {
      title: string;
      company: {
        company_name: string;
      };
    };
  };
}

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  application_id?: string;
  avatar_url?: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [currentVideoCall, setCurrentVideoCall] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read_at,
          application_id,
          sender:profiles!messages_sender_id_fkey(full_name, email, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(full_name, email, avatar_url)
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationMap = new Map<string, Conversation>();
      
      data?.forEach((message) => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === user?.id ? message.receiver : message.sender;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            other_user_name: otherUser.full_name || otherUser.email,
            other_user_email: otherUser.email,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user?.id && !message.read_at ? 1 : 0,
            application_id: message.application_id,
            avatar_url: otherUser.avatar_url
          });
        } else {
          const existing = conversationMap.get(otherUserId);
          if (existing && message.receiver_id === user?.id && !message.read_at) {
            existing.unread_count += 1;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, email, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(full_name, email, avatar_url),
          application:applications(
            job:jobs(
              title,
              company:companies(company_name)
            )
          )
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('receiver_id', user?.id)
        .eq('sender_id', otherUserId)
        .is('read_at', null);

      setConversations(prev => prev.map(conv => 
        conv.other_user_id === otherUserId ? { ...conv, unread_count: 0 } : conv
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedConversation,
          content: newMessage,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const startVideoCall = async () => {
    if (!selectedConversation) return;

    try {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          room_id: roomId,
          host_id: user?.id,
          guest_id: selectedConversation,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentVideoCall(data);
      setVideoCallModalOpen(true);

      await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedConversation,
          content: 'Video call invitation',
          message_type: 'video_call_invite',
          video_call_id: data.id
        });

      fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive"
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 animate-pulse"></div>
            <div className="h-4 w-48 rounded bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 animate-pulse"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              >
                <Mail className="h-4 w-4" />
                <span>All Messages</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <UserPlus className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
            {/* Conversations List */}
            <div className="lg:col-span-4">
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-semibold text-xl">Conversations</CardTitle>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Schedule meeting</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10 bg-white/20 border-none text-white placeholder:text-white/80 focus-visible:ring-white/30 rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-96px)]">
                  <ScrollArea className="h-full">
                    {filteredConversations.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={conversation.other_user_id}
                            className={cn(
                              "p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 group",
                              selectedConversation === conversation.other_user_id 
                                ? 'bg-blue-50/80 dark:bg-slate-700/70 border-l-4 border-blue-500' 
                                : ''
                            )}
                            onClick={() => setSelectedConversation(conversation.other_user_id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="border-2 border-white shadow-lg group-hover:border-blue-100 transition-all duration-200">
                                  <AvatarImage src={conversation.avatar_url} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                    {conversation.other_user_name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate text-slate-800 dark:text-slate-100">
                                    {conversation.other_user_name}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(conversation.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {conversation.last_message.length > 30 
                                      ? `${conversation.last_message.substring(0, 30)}...` 
                                      : conversation.last_message}
                                  </p>
                                  {conversation.unread_count > 0 && (
                                    <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                      {conversation.unread_count}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full opacity-20 blur-lg"></div>
                          <Mail className="relative h-12 w-12 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                          No conversations found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
                        </p>
                        <Button className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                          Start New Chat
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="lg:col-span-8">
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                {selectedConversation ? (
                  <>
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="border-2 border-white shadow-lg">
                              <AvatarImage src={
                                conversations.find(c => c.other_user_id === selectedConversation)?.avatar_url
                              } />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                {conversations.find(c => c.other_user_id === selectedConversation)?.other_user_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                          </div>
                          <div>
                            <CardTitle className="text-white">
                              {conversations.find(c => c.other_user_id === selectedConversation)?.other_user_name}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                              <span className="text-xs text-white/90">Online now</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-white hover:bg-white/10 rounded-full"
                                  onClick={startVideoCall}
                                >
                                  <Video className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Start video call</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-white hover:bg-white/10 rounded-full"
                                >
                                  <Phone className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Voice call</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-white hover:bg-white/10 rounded-full"
                                >
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>More options</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
                      {/* Messages Container */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 dark:opacity-[0.02]"></div>
                        <ScrollArea className="flex-1 p-6 h-[calc(100vh-300px)]">
                          <div className="space-y-6">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex",
                                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                                )}
                              >
                                <div
                                  className={cn(
                                    "max-w-xs lg:max-w-md px-5 py-3 rounded-3xl relative",
                                    "shadow-sm transition-all duration-200",
                                    message.sender_id === user?.id
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none'
                                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-md',
                                    message.message_type === 'video_call_invite' ? 'w-full max-w-md' : ''
                                  )}
                                >
                                  {message.message_type === 'video_call_invite' && (
                                    <div className="flex flex-col items-center gap-3 mb-3 p-4 bg-white/10 dark:bg-black/20 rounded-xl">
                                      <div className="flex items-center gap-2">
                                        <Video className="h-5 w-5" />
                                        <Badge variant="secondary">Video Call Invitation</Badge>
                                      </div>
                                      <Button 
                                        variant={message.sender_id === user?.id ? "secondary" : "default"}
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                          setCurrentVideoCall({
                                            id: message.video_call_id,
                                            room_id: `room_${message.id}`,
                                            host_id: message.sender_id,
                                            guest_id: message.receiver_id
                                          });
                                          setVideoCallModalOpen(true);
                                        }}
                                      >
                                        {message.sender_id === user?.id ? 'Waiting for response...' : 'Join Video Call'}
                                      </Button>
                                    </div>
                                  )}
                                  <p className="text-sm">{message.content}</p>
                                  <div className={cn(
                                    "flex items-center justify-end mt-1 text-xs",
                                    message.sender_id === user?.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                                  )}>
                                    <span>
                                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {message.sender_id === user?.id && message.read_at && (
                                      <span className="ml-1">✓✓</span>
                                    )}
                                  </div>
                                  <div className={cn(
                                    "absolute top-0 h-4 w-4",
                                    message.sender_id === user?.id 
                                      ? '-right-4 bg-gradient-to-r from-blue-500 to-indigo-500 clip-triangle-right'
                                      : '-left-4 bg-white dark:bg-slate-700 clip-triangle-left shadow-md'
                                  )}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Paperclip className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Mic className="h-5 w-5" />
                          </Button>
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 rounded-full bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                          />
                          <Button 
                            onClick={sendMessage} 
                            size="sm" 
                            className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center h-full p-8">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full opacity-20 blur-xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-inner">
                        <Mail className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
                      Choose an existing conversation from the sidebar or start a new one to begin messaging.
                    </p>
                    <Button 
                      className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                    >
                      Start New Chat
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        videoCall={currentVideoCall}
      />
      
      <Footer />
    </div>
  );
};

export default Messages;