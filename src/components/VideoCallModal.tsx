import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, User, Settings, Maximize, Minimize, MessageSquare, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoCall: any;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, videoCall }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState(100);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const qualityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Initialize and clean up call
  useEffect(() => {
    if (isOpen && videoCall) {
      initializeCall();
      simulateNetworkQuality();
    }
    return () => cleanup();
  }, [isOpen, videoCall]);

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      await supabase
        .from('video_calls')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', videoCall.id);

      setCallStatus('connected');
      
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Call Started",
        description: "Video call is now active",
        className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0"
      });

    } catch (error) {
      console.error('Error initializing call:', error);
      toast({
        title: "Error",
        description: "Failed to access camera/microphone",
        variant: "destructive",
        className: "border-0"
      });
    }
  };

  const simulateNetworkQuality = () => {
    qualityIntervalRef.current = setInterval(() => {
      setNetworkQuality(Math.floor(Math.random() * 16) + 85);
    }, 3000);
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (qualityIntervalRef.current) clearInterval(qualityIntervalRef.current);
  };

  const endCall = async () => {
    try {
      await supabase
        .from('video_calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', videoCall.id);

      const otherUserId = videoCall.host_id === user?.id ? videoCall.guest_id : videoCall.host_id;
      await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: otherUserId,
          content: `Video call ended (Duration: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')})`,
          message_type: 'video_call_ended',
          video_call_id: videoCall.id,
          video_call_duration: callDuration
        });

      setCallStatus('ended');
      cleanup();
      onClose();

      toast({
        title: "Call Ended",
        description: `Call duration: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`,
        className: "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0",
        action: (
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => {
              setCallStatus('connecting');
              setCallDuration(0);
              initializeCall();
            }}
          >
            Call Back
          </Button>
        )
      });

    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "Failed to end call properly",
        variant: "destructive",
        className: "border-0"
      });
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => track.enabled = !isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => track.enabled = !isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNetworkQualityColor = (quality: number) => {
    if (quality > 90) return 'bg-emerald-400';
    if (quality > 75) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && endCall()}>
      <DialogContent 
        ref={dialogRef}
        className={cn(
          "max-w-7xl h-[90vh] p-0 overflow-hidden border-0",
          isFullscreen ? "w-screen h-screen max-w-none rounded-none" : "rounded-2xl"
        )}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Main Video Feed with Glass Morphism Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/0" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/0" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-black/0" />
          </div>
          
          {/* Floating User Info (Top Center) */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-lg rounded-full px-6 py-2 flex items-center gap-3 border border-white/10 shadow-lg">
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src={videoCall?.guest?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                {videoCall?.guest?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-white font-medium">{videoCall?.guest?.full_name || 'Call Participant'}</h3>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  callStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                )} />
                <span className="text-white/80">
                  {callStatus === 'connected' ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Bar (Top Right) */}
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${getNetworkQualityColor(networkQuality)}`} />
              <span className="text-xs font-medium text-white">
                {networkQuality}% Network
              </span>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <span className="text-xs font-medium text-white">
                {formatDuration(callDuration)}
              </span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 h-9 w-9 rounded-full"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white border-gray-700">
                  {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Local Video (Floating with Elegant Border) */}
          <div className={cn(
            "absolute right-6 bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 shadow-2xl border-2 border-white/10",
            isVideoEnabled ? "w-72 h-48 bottom-28" : "w-16 h-16 bottom-32",
            isVideoEnabled ? "hover:border-indigo-400/50" : "hover:border-white/30"
          )}>
            {isVideoEnabled ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none border border-white/5" />
          </div>
          
          {/* Connecting Overlay (Animated) */}
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95 flex flex-col items-center justify-center">
              <div className="text-center animate-pulse">
                <div className="relative mb-8">
                  <Avatar className="h-28 w-28 border-4 border-white/10 shadow-xl">
                    <AvatarImage src={videoCall?.guest?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-4xl">
                      {videoCall?.guest?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2 shadow-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-semibold text-white mb-2">
                  Calling {videoCall?.guest?.full_name || 'User'}
                </h3>
                <p className="text-gray-300 mb-8">Establishing secure connection...</p>
                
                <div className="w-64 mx-auto">
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ 
                        width: `${Math.min(100, callDuration * 10)}%`,
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Control Bar (Floating Glass Panel) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleVideo}
                      size="lg"
                      className={cn(
                        "rounded-full h-12 w-12 transition-all hover:scale-105 active:scale-95",
                        isVideoEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500/90 hover:bg-rose-600 text-white"
                      )}
                    >
                      {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    {isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleAudio}
                      size="lg"
                      className={cn(
                        "rounded-full h-12 w-12 transition-all hover:scale-105 active:scale-95",
                        isAudioEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500/90 hover:bg-rose-600 text-white"
                      )}
                    >
                      {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    {isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      size="lg"
                      className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    Call settings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                onClick={endCall}
                size="lg"
                className="rounded-full h-14 w-14 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    Send message
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                      size="lg"
                      className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    More options
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Settings Panel (Glass Morphism) */}
          {isSettingsOpen && (
            <div className="absolute right-8 bottom-32 w-72 bg-white/5 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Call Settings</h4>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/70 mb-1 block uppercase tracking-wider">Camera</label>
                  <select className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30">
                    <option className="bg-gray-800">Default Camera</option>
                    <option className="bg-gray-800">Front Camera</option>
                    <option className="bg-gray-800">Back Camera</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-white/70 mb-1 block uppercase tracking-wider">Microphone</label>
                  <select className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30">
                    <option className="bg-gray-800">Default Microphone</option>
                    <option className="bg-gray-800">Headset Microphone</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-white/70 mb-1 block uppercase tracking-wider">Speaker</label>
                  <select className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30">
                    <option className="bg-gray-800">Default Speaker</option>
                    <option className="bg-gray-800">Headphones</option>
                  </select>
                </div>
                
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70 uppercase tracking-wider">Video Quality</span>
                    <span className="text-xs font-medium text-indigo-400">HD 1080p</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* More Options Panel */}
          {isMoreOptionsOpen && (
            <div className="absolute right-8 bottom-32 w-56 bg-white/5 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-white/10">
              <button className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                Record Call
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                Share Screen
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                Invite Participant
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                View Full Profile
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;