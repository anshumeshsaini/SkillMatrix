import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, X, Send } from 'lucide-react';

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
      onApplicationSubmitted();
      onClose();

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
      <DialogContent className="max-w-2xl rounded-xl bg-gradient-to-br from-white to-gray-50 p-0 overflow-hidden shadow-2xl border-0">
        <div className="absolute top-0 right-0 p-2">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-8 w-8" />
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    Apply for {job?.title}
                  </DialogTitle>
                  <p className="text-sm text-blue-100 mt-1">
                    {job?.company_name}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="cover-letter" className="flex items-center text-gray-700 mb-2">
                  <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                  Cover Letter
                </Label>
                <Textarea
                  id="cover-letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're the perfect fit for this position..."
                  rows={8}
                  className="mt-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Highlight your relevant skills and experience
                </p>
              </motion.div>
              
              <motion.div 
                className="flex gap-3 justify-end pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="rounded-full px-6 border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;