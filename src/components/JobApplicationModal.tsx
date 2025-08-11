import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Briefcase, X, Send, User, Award, Clock, MapPin, ChevronRight } from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onApplicationSubmitted: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  onApplicationSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Check if candidate profile exists, create if not
      const { data: candidateExists } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!candidateExists) {
        const { error: candidateError } = await supabase
          .from('candidates')
          .insert({
            id: user.id,
            experience_years: 0,
            availability_status: 'open'
          });

        if (candidateError) {
          console.error('Error creating candidate profile:', candidateError);
          throw candidateError;
        }
      }

      // Submit application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          candidate_id: user.id,
          cover_letter: coverLetter,
          status: 'pending'
        });

      if (applicationError) {
        console.error('Error submitting application:', applicationError);
        throw applicationError;
      }

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the company. You can now message them directly.",
      });

      setCoverLetter('');
      setStep(3); // Show success step
      setTimeout(() => {
        onApplicationSubmitted();
        onClose();
        setStep(1); // Reset for next time
      }, 2500);

    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === '23505') {
        toast({
          title: "Already Applied",
          description: "You have already applied for this position.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-blue-100/50 transition-all duration-300 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 h-full w-full">
          <div className="relative z-10 h-full">
            <DialogHeader className="px-10 pt-10 pb-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-inner mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <DialogTitle className="text-3xl font-bold tracking-tight text-gray-900">
                  {job?.title}
                </DialogTitle>
                <p className="text-blue-600 mt-2 flex items-center text-lg">
                  <span className="font-medium">{job?.company_name}</span>
                  <span className="mx-3">•</span>
                  <span className="flex items-center"><MapPin className="h-5 w-5 mr-1.5" /> {job?.location}</span>
                </p>
              </div>
              
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-blue-100 flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-800">Full-time</span>
                </div>
                <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-blue-100 flex items-center">
                  <Award className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-800">Mid Level</span>
                </div>
                <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-blue-100 flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-800">On-site</span>
                </div>
              </div>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="px-10 pb-10"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Application Preview</h3>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg">{user?.email}</h4>
                          <p className="text-sm text-blue-600">Your profile will be attached</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-3 border-b border-blue-100">
                          <span className="text-gray-600 font-medium">Position</span>
                          <span className="font-semibold text-gray-900">{job?.title}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-blue-100">
                          <span className="text-gray-600 font-medium">Company</span>
                          <span className="font-semibold text-gray-900">{job?.company_name}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-gray-600 font-medium">Location</span>
                          <span className="font-semibold text-gray-900">{job?.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      onClick={() => setStep(2)}
                      className="px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center gap-2 shadow-lg hover:shadow-blue-200/50 transition-all"
                    >
                      Continue Application
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="px-10 pb-10"
                >
                  <div className="mb-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm"
                    >
                      <Label htmlFor="cover-letter" className="flex items-center text-gray-900 mb-3 text-lg">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                        Your Cover Letter
                      </Label>
                      <Textarea
                        id="cover-letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder={`Dear Hiring Manager,\n\nI'm excited to apply for the ${job?.title} position at ${job?.company_name}...`}
                        rows={8}
                        className="mt-1 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 transition-all shadow-sm bg-white/50 text-gray-900"
                      />
                      <p className="text-sm text-blue-600 mt-3">
                        Highlight your relevant skills and experience (minimum 50 characters)
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex gap-4 justify-between pt-6 border-t border-blue-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="rounded-xl border-blue-200 hover:bg-blue-50/50 text-blue-600 px-8 py-3"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || coverLetter.length < 50}
                      className="px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center gap-2 shadow-lg hover:shadow-blue-200/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="px-10 py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
                  <p className="text-gray-700 mb-8 text-lg max-w-md">
                    Your application for <span className="text-blue-600 font-medium">{job?.title}</span> at <span className="text-blue-600 font-medium">{job?.company_name}</span> has been successfully submitted.
                  </p>
                  <div className="w-full max-w-xs bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 shadow-sm mb-8">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Next Steps</span>
                      <span className="text-blue-600 font-medium">2-3 business days</span>
                    </div>
                  </div>
                  <Button 
                    onClick={onClose}
                    className="px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center gap-2 shadow-lg hover:shadow-blue-200/50 transition-all"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;