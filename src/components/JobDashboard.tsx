import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, Building, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import JobApplicationModal from './JobApplicationModal';
import JobPostingModal from './JobPostingModal';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  remote_allowed: boolean;
  created_at: string;
  company: {
    company_name: string;
    logo_url?: string;
  };
  job_skills: Array<{
    skill: {
      name: string;
      category: string;
    };
    required_level: number;
    is_required: boolean;
  }>;
}

const JobDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(company_name, logo_url),
          job_skills(
            required_level,
            is_required,
            skill:skills(name, category)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to apply for jobs",
        variant: "destructive"
      });
      return;
    }
    setSelectedJob(job);
    setApplicationModalOpen(true);
  };

  const handleJobPosted = () => {
    setJobPostingModalOpen(false);
    fetchJobs();
    toast({
      title: "Job Posted Successfully",
      description: "Your job posting is now live and visible to candidates."
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  const getBadgeStyle = (type: string, value: string) => {
    // For Remote OK badge
    if (type === 'remote') {
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    }
    
    // For experience levels
    if (type === 'experience') {
      switch (value.toLowerCase()) {
        case 'entry':
          return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        case 'mid':
          return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
        case 'senior':
          return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
        case 'lead':
          return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      }
    }
    
    // Default badge style
    return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-blue-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-4 md:p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-blue-800">Recommended for you</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-blue-600">
           
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-lg transition-shadow border border-gray-200 bg-white"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg text-blue-900">{job.title}</CardTitle>
                    <p className="text-xs md:text-sm text-blue-700">{job.company.company_name}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-blue-600">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {job.location}
                </div>
                {job.remote_allowed && (
                  <Badge className={getBadgeStyle('remote', '')}>
                    Remote OK
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm">
                <div className="flex items-center text-blue-600">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
                <Badge className={getBadgeStyle('experience', job.experience_level)}>
                  {job.experience_level}
                </Badge>
              </div>

              <p className="text-xs md:text-sm text-gray-700 line-clamp-3">
                {job.description}
              </p>

              {job.job_skills && job.job_skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.job_skills.slice(0, 3).map((jobSkill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-blue-200 text-blue-700"
                    >
                      {jobSkill.skill.name}
                    </Badge>
                  ))}
                  {job.job_skills.length > 3 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-blue-200 text-blue-700"
                    >
                      +{job.job_skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs text-blue-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
                <Button 
                  onClick={() => handleApplyClick(job)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm"
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="border-gray-200 bg-white">
          <CardContent className="text-center py-8 md:py-12">
            <Users className="h-10 w-10 md:h-12 md:w-12 text-blue-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-medium text-blue-800 mb-1 md:mb-2">No jobs available</h3>
            <p className="text-sm md:text-base text-blue-600">Check back later for new opportunities!</p>
          </CardContent>
        </Card>
      )}

      <JobApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        job={selectedJob}
        onApplicationSubmitted={fetchJobs}
      />

      {jobPostingModalOpen && (
        <JobPostingModal
          onClose={() => setJobPostingModalOpen(false)}
          onJobPosted={handleJobPosted}
        />
      )}
    </div>
  );
};

export default JobDashboard;