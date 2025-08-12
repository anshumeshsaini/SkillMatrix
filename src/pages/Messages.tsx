import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Video, Phone, Clock, Mail, Search, ChevronDown, MoreVertical, Smile, Paperclip, Mic, Calendar, UserPlus, X, Maximize2, Minimize2, Menu, Plus, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoCallModal from '@/components/VideoCallModal';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedConversation) {
      inputRef.current?.focus();
    }
  }, [selectedConversation]);

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
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
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
      await fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 animate-pulse"></div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse"></div>
            </div>
            <div className="h-4 w-48 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 animate-pulse"></div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Floating Glass Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6 p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30"
          >
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Celestial Conversations
              </h1>
              <p className="text-sm text-blue-600/80 mt-1">
                Connect with the universe
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
               
              </motion.div>
            </div>
          </motion.div>
          
          {/* Main content grid with floating glass effect */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
            {/* Conversations List - Mobile Menu Button */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 backdrop-blur-sm bg-white/80 border border-white/30 shadow-sm text-blue-800"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                  <span>Conversations</span>
                </Button>
              </motion.div>
              {selectedConversation && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="backdrop-blur-sm bg-white/80 border border-white/30 shadow-sm text-blue-800"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Conversations List */}
            <AnimatePresence>
              {(isMobileMenuOpen || !selectedConversation || !isMobileMenuOpen) && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "lg:col-span-4",
                    selectedConversation ? "hidden lg:block" : "block"
                  )}
                >
                  {/* Glass card with floating effect */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="h-full rounded-3xl overflow-hidden"
                  >
                    <Card className="h-full border-0 bg-white/90 backdrop-blur-xl shadow-xl border border-white/30">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl relative overflow-hidden">
                        {/* Floating particles background */}
                        <div className="absolute inset-0 opacity-20">
                          {[...Array(15)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full bg-white"
                              style={{
                                width: Math.random() * 5 + 2,
                                height: Math.random() * 5 + 2,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                y: [0, (Math.random() - 0.5) * 20],
                                x: [0, (Math.random() - 0.5) * 20],
                              }}
                              transition={{
                                duration: Math.random() * 5 + 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <CardTitle className="text-white font-semibold text-xl flex items-center gap-2">
                              <Mail className="h-5 w-5" />
                              <span>Messages</span>
                            </CardTitle>
                          </motion.div>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="backdrop-blur-sm bg-white/90 border border-white/30">
                                  <p>Schedule meeting</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="backdrop-blur-sm bg-white/90 border border-white/30">
                                  <p>More options</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="relative mt-4"
                        >
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
                          <Input
                            placeholder="Search messages..."
                            className="pl-10 bg-white/20 border-none text-white placeholder:text-white/80 focus-visible:ring-white/30 rounded-full shadow-inner backdrop-blur-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </motion.div>
                      </CardHeader>
                      <CardContent className="p-0 h-[calc(100%-96px)]">
                        <ScrollArea className="h-full">
                          {filteredConversations.length > 0 ? (
                            <div className="divide-y divide-blue-100/50">
                              {filteredConversations.map((conversation) => (
                                <motion.div
                                  key={conversation.other_user_id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={cn(
                                    "p-4 cursor-pointer transition-all duration-300 hover:bg-blue-50/50 group relative",
                                    selectedConversation === conversation.other_user_id 
                                      ? 'bg-gradient-to-r from-blue-50/80 to-cyan-50/50' 
                                      : ''
                                  )}
                                  onClick={() => {
                                    setSelectedConversation(conversation.other_user_id);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  whileHover={{ scale: 1.005 }}
                                >
                                  {/* Active conversation indicator */}
                                  {selectedConversation === conversation.other_user_id && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full"></div>
                                  )}
                                  <div className="flex items-center space-x-3">
                                    <div className="relative">
                                      <motion.div whileHover={{ scale: 1.1 }}>
                                        <Avatar className="border-2 border-white shadow-lg group-hover:border-blue-100 transition-all duration-300">
                                          <AvatarImage src={conversation.avatar_url} />
                                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                            {conversation.other_user_name.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      </motion.div>
                                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="font-medium truncate text-blue-900">
                                          {conversation.other_user_name}
                                        </p>
                                        <p className="text-xs text-blue-600/80">
                                          {new Date(conversation.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm text-blue-800/80 truncate">
                                          {conversation.last_message.length > 30 
                                            ? `${conversation.last_message.substring(0, 30)}...` 
                                            : conversation.last_message}
                                        </p>
                                        {conversation.unread_count > 0 && (
                                          <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                          >
                                            <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm">
                                              {conversation.unread_count}
                                            </Badge>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col items-center justify-center h-full p-8 text-center"
                            >
                              <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-lg"></div>
                                <Mail className="relative h-12 w-12 text-blue-500" />
                              </div>
                              <h3 className="text-lg font-medium text-blue-900 mb-2">
                                No conversations found
                              </h3>
                              <p className="text-sm text-blue-800/80 mt-1">
                                {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
                              </p>
                              <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                className="mt-6 relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
                                <Button className="relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md z-10">
                                  New Message
                                </Button>
                              </motion.div>
                            </motion.div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className={cn(
              "lg:col-span-8",
              !selectedConversation ? "hidden lg:block" : "block"
            )}>
              {/* Floating glass message panel */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full rounded-3xl overflow-hidden"
              >
                <Card className="h-full border-0 bg-white/90 backdrop-blur-xl shadow-xl border border-white/30">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl relative overflow-hidden">
                        {/* Floating particles background */}
                        <div className="absolute inset-0 opacity-20">
                          {[...Array(15)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full bg-white"
                              style={{
                                width: Math.random() * 5 + 2,
                                height: Math.random() * 5 + 2,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                y: [0, (Math.random() - 0.5) * 20],
                                x: [0, (Math.random() - 0.5) * 20],
                              }}
                              transition={{
                                duration: Math.random() * 5 + 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar className="border-2 border-white shadow-lg">
                                  <AvatarImage src={
                                    conversations.find(c => c.other_user_id === selectedConversation)?.avatar_url
                                  } />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                    {conversations.find(c => c.other_user_id === selectedConversation)?.other_user_name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse"></div>
                            </div>
                            <div>
                              <CardTitle className="text-white">
                                {conversations.find(c => c.other_user_id === selectedConversation)?.other_user_name}
                              </CardTitle>
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                                <span className="text-xs text-white/90">Online</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-white hover:bg-white/10 rounded-full"
                                      onClick={startVideoCall}
                                    >
                                      <Video className="h-5 w-5" />
                                    </Button>
                                  </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="backdrop-blur-sm bg-white/90 border border-white/30">
                                  <p>Start video call</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-white hover:bg-white/10 rounded-full"
                                    >
                                      <Phone className="h-5 w-5" />
                                    </Button>
                                  </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="backdrop-blur-sm bg-white/90 border border-white/30">
                                  <p>Voice call</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-white hover:bg-white/10 rounded-full"
                                      onClick={() => setIsFullscreen(!isFullscreen)}
                                    >
                                      {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                                    </Button>
                                  </motion.div>
                                </TooltipTrigger>
                                <TooltipContent className="backdrop-blur-sm bg-white/90 border border-white/30">
                                  <p>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
                        {/* Messages Container */}
                        <div className="relative flex-1">
                          {/* Watercolor background */}
                          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                          <ScrollArea className="flex-1 p-6 h-[calc(100vh-300px)]">
                            <div className="space-y-6">
                              {messages.map((message) => (
                                <motion.div
                                  key={message.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={cn(
                                    "flex",
                                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                                  )}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className={cn(
                                      "max-w-xs lg:max-w-md px-5 py-3 rounded-3xl relative",
                                      "shadow-sm transition-all duration-300 backdrop-blur-sm",
                                      message.sender_id === user?.id
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none'
                                        : 'bg-white text-blue-900 rounded-bl-none shadow-md',
                                      message.message_type === 'video_call_invite' ? 'w-full max-w-md' : ''
                                    )}
                                  >
                                    {message.message_type === 'video_call_invite' && (
                                      <div className="flex flex-col items-center gap-3 mb-3 p-4 bg-white/10 rounded-xl">
                                        <div className="flex items-center gap-2">
                                          <Video className="h-5 w-5" />
                                          <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 border border-white/30">
                                            Video Call
                                          </Badge>
                                        </div>
                                        <motion.div 
                                          whileHover={{ scale: 1.03 }} 
                                          whileTap={{ scale: 0.97 }}
                                          className="w-full"
                                        >
                                          <Button 
                                            variant={message.sender_id === user?.id ? "secondary" : "default"}
                                            size="sm"
                                            className="w-full backdrop-blur-sm"
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
                                        </motion.div>
                                      </div>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <div className={cn(
                                      "flex items-center justify-end mt-1 text-xs",
                                      message.sender_id === user?.id ? 'text-blue-100' : 'text-blue-600/80'
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
                                        ? '-right-4 bg-gradient-to-r from-blue-500 to-cyan-500 clip-triangle-right'
                                        : '-left-4 bg-white clip-triangle-left shadow-md'
                                    )}></div>
                                  </motion.div>
                                </motion.div>
                              ))}
                              <div ref={messagesEndRef} />
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-blue-100/50 bg-white/90 backdrop-blur-lg">
                          <div className="flex gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 rounded-full hover:bg-blue-100/50 backdrop-blur-sm"
                              >
                                <Paperclip className="h-5 w-5" />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 rounded-full hover:bg-blue-100/50 backdrop-blur-sm"
                              >
                                <Smile className="h-5 w-5" />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 rounded-full hover:bg-blue-100/50 backdrop-blur-sm"
                              >
                                <Mic className="h-5 w-5" />
                              </Button>
                            </motion.div>
                            <Input
                              ref={inputRef}
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message here..."
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              className="flex-1 rounded-full bg-blue-50/50 border-blue-200/50 focus-visible:ring-2 focus-visible:ring-blue-500/30 shadow-inner backdrop-blur-sm text-blue-900"
                            />
                            <motion.div 
                              whileHover={{ scale: 1.05 }} 
                              whileTap={{ scale: 0.95 }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
                              <Button 
                                onClick={sendMessage} 
                                size="sm" 
                                disabled={isSending}
                                className="relative rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md z-10"
                              >
                                {isSending ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <Send className="h-5 w-5" />
                                )}
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex flex-col items-center justify-center h-full p-8">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative mb-8"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-2xl shadow-inner backdrop-blur-sm">
                          <Mail className="h-12 w-12 text-blue-500" />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-medium text-blue-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-sm text-blue-800/80 text-center max-w-md">
                        Choose an existing conversation or start a new one to begin messaging.
                      </p>
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
                      
                      </motion.div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
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