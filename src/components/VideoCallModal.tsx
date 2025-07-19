import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, User, Settings, Maximize, Minimize, MessageSquare } from 'lucide-react';
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
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const qualityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && videoCall) {
      initializeCall();
      simulateNetworkQuality();
    }
    return () => {
      cleanup();
    };
  }, [isOpen, videoCall]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Update call status to active
      await supabase
        .from('video_calls')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', videoCall.id);

      setCallStatus('connected');
      
      // Start call duration timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Call Started",
        description: "Video call is now active"
      });

    } catch (error) {
      console.error('Error initializing call:', error);
      toast({
        title: "Error",
        description: "Failed to access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const simulateNetworkQuality = () => {
    qualityIntervalRef.current = setInterval(() => {
      // Simulate network quality fluctuations (85-100%)
      setNetworkQuality(Math.floor(Math.random() * 16) + 85);
    }, 3000);
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (qualityIntervalRef.current) {
      clearInterval(qualityIntervalRef.current);
      qualityIntervalRef.current = null;
    }
  };

  const endCall = async () => {
    try {
      // Update call status
      await supabase
        .from('video_calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', videoCall.id);

      // Send end call message
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
        action: (
          <Button variant="ghost" onClick={() => {
            setCallStatus('connecting');
            setCallDuration(0);
            initializeCall();
          }}>
            Call Back
          </Button>
        )
      });

    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "Failed to end call properly",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
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
    if (quality > 90) return 'bg-green-500';
    if (quality > 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) endCall();
    }}>
      <DialogContent 
        ref={dialogRef}
        className={cn(
          "max-w-6xl h-[80vh] p-0 overflow-hidden",
          isFullscreen ? "w-screen h-screen max-w-none rounded-none" : "rounded-xl"
        )}
      >
        <div className="relative w-full h-full bg-gray-900">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-white">
                  {callStatus === 'connected' ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getNetworkQualityColor(networkQuality)}`}></div>
                <span className="text-sm text-white">
                  Network: {networkQuality}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-white">
                {formatDuration(callDuration)}
              </span>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Local Video (Picture-in-Picture) */}
          <div className={cn(
            "absolute right-4 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 shadow-xl border-2 border-white/20",
            isVideoEnabled ? "w-64 h-48 bottom-24" : "w-16 h-16 bottom-28"
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
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          
          {/* Call Status Overlay */}
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="relative mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={videoCall?.guest?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {videoCall?.guest?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-1">
                  Calling {videoCall?.guest?.full_name || 'User'}
                </h3>
                <p className="text-gray-300">Connecting to video call...</p>
                
                <div className="mt-8 w-48">
                  <Progress value={45} className="h-2 bg-gray-700" />
                </div>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center justify-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleVideo}
                      size="lg"
                      className={cn(
                        "rounded-full h-14 w-14 transition-all",
                        isVideoEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                      )}
                    >
                      {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
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
                        "rounded-full h-14 w-14 transition-all",
                        isAudioEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                      )}
                    >
                      {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
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
                      className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Settings className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Call settings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                onClick={endCall}
                size="lg"
                className="rounded-full h-16 w-16 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <MessageSquare className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Send message
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Settings Panel */}
          {isSettingsOpen && (
            <div className="absolute right-4 bottom-28 w-64 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Call Settings</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Camera</label>
                  <select className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600">
                    <option>Default Camera</option>
                    <option>Front Camera</option>
                    <option>Back Camera</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Microphone</label>
                  <select className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600">
                    <option>Default Microphone</option>
                    <option>Headset Microphone</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Speaker</label>
                  <select className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600">
                    <option>Default Speaker</option>
                    <option>Headphones</option>
                  </select>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Video Quality</span>
                    <span className="text-sm text-blue-400">HD</span>
                  </div>
                  <Progress value={80} className="h-1.5 mt-2 bg-gray-700" />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;