import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, User, Mail, Calendar, MessageSquare, Video, ChevronDown, ChevronUp, Star, Check, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface ApplicationsModalProps {
  jobId: string;
  onClose: () => void;
}

const ApplicationsModal = ({ jobId, onClose }: ApplicationsModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          candidate:profiles(
            id,
            full_name,
            email,
            skills,
            experience_level,
            avatar_url
          ),
          job:jobs(
            id,
            title
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setUpdatingStatus(applicationId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application status changed to ${status}`,
        className: "bg-gradient-to-r from-green-400 to-blue-500 text-white"
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const startConversation = async (candidateId: string, applicationId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: candidateId,
          application_id: applicationId,
          content: "Thank you for your application. We'd like to discuss this opportunity with you.",
          message_type: 'text'
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Conversation started with candidate",
        className: "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
      });
    } catch (error: any) {  
      toast({
        title: "Error starting conversation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleApplicationExpand = (applicationId: string) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Job Applications
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {applications?.length || 0} candidate{applications?.length !== 1 ? 's' : ''} applied
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto">
          {applications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
                <User className="h-12 w-12 text-slate-400 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                No applications yet
              </h3>
              <p className="text-slate-500 max-w-md">
                Your job posting hasn't received any applications yet. Check back later or consider promoting your listing.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {applications?.map((application: any) => (
                <div 
                  key={application.id} 
                  className={`transition-all duration-300 ${expandedApplication === application.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                >
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => toggleApplicationExpand(application.id)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-700">
                        <AvatarImage src={application.candidate.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {application.candidate.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold truncate">
                            {application.candidate.full_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                application.status === 'pending' ? 'secondary' :
                                application.status === 'reviewed' ? 'default' :
                                application.status === 'interviewed' ? 'default' :
                                application.status === 'rejected' ? 'destructive' :
                                'default'
                              }
                              className="rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {application.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {application.status === 'reviewed' && <Check className="h-3 w-3 mr-1" />}
                              {application.status === 'interviewed' && <Video className="h-3 w-3 mr-1" />}
                              {application.status === 'rejected' && <ThumbsDown className="h-3 w-3 mr-1" />}
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                            {expandedApplication === application.id ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1.5" />
                            <span className="truncate max-w-[180px]">{application.candidate.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                          {application.candidate.experience_level && (
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 mr-1.5" />
                              <span>{application.candidate.experience_level}</span>
                            </div>
                          )}
                        </div>
                        
                        {application.candidate.skills?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {application.candidate.skills.slice(0, 3).map((skill: string, index: number) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs rounded-full bg-slate-800/50 border-slate-700 text-slate-300"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {application.candidate.skills.length > 3 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs rounded-full bg-slate-800/50 border-slate-700 text-slate-400"
                              >
                                +{application.candidate.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedApplication === application.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-700 space-y-4 animate-in fade-in">
                      {application.cover_letter && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Cover Letter
                          </h4>
                          <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm leading-relaxed">
                            {application.cover_letter}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Application Progress</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Application Status</span>
                            <span className="font-medium">
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                          <Progress 
                            value={
                              application.status === 'pending' ? 25 :
                              application.status === 'reviewed' ? 50 :
                              application.status === 'interviewed' ? 75 :
                              application.status === 'rejected' ? 100 : 0
                            }
                            className="h-2 bg-slate-700"
                            indicatorClassName={
                              application.status === 'rejected' ? 'bg-red-500' : 
                              'bg-gradient-to-r from-purple-500 to-pink-500'
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                          disabled={updatingStatus === application.id}
                          className="rounded-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Reviewed
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'interviewed')}
                          disabled={updatingStatus === application.id}
                          className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Schedule Interview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => startConversation(application.candidate.id, application.id)}
                          className="rounded-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          disabled={updatingStatus === application.id}
                          className="rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsModal;