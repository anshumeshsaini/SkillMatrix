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
      <DialogContent className="max-w-4xl rounded-2xl bg-white p-0 overflow-hidden shadow-xl border border-gray-100">
        <div className="absolute top-4 right-4">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative h-full">
          <div className="relative z-10 h-full">
            <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {job?.title}
                  </DialogTitle>
                  <p className="text-blue-100 mt-1 flex items-center">
                    <span className="font-medium">{job?.company_name}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {job?.location}</span>
                  </p>
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
                  className="px-8 py-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user?.email}</h4>
                          <p className="text-sm text-gray-500">Your profile will be attached</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Position</span>
                          <span className="font-medium">{job?.title}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Company</span>
                          <span className="font-medium">{job?.company_name}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Location</span>
                          <span className="font-medium">{job?.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      onClick={() => setStep(2)}
                      className="px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2 shadow-md"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
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
                  className="px-8 py-6"
                >
                  <div className="mb-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="cover-letter" className="flex items-center text-gray-700 mb-2">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                        Cover Letter
                      </Label>
                      <Textarea
                        id="cover-letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder={`Dear Hiring Manager,\n\nI'm excited to apply for the ${job?.title} position at ${job?.company_name}...`}
                        rows={6}
                        className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Highlight your relevant skills and experience
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex gap-3 justify-between pt-4 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="rounded-full border-gray-300 hover:bg-gray-50"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2 shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
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
                  className="px-8 py-10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Your application for {job?.title} at {job?.company_name} has been successfully submitted.
                  </p>
                  <Button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2 shadow-md"
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