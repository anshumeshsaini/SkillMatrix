import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, Building, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import JobApplicationModal from './JobApplicationModal';
import JobPostingModal from './JobPostingModal';
import styled from 'styled-components';

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

const StyledButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        Apply Now
        <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
          <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
    padding: 0.35rem 0.8rem;
    background-color: rgb(0 107 179);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffff;
    gap: 6px;
    font-weight: bold;
    border: 2px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 13px;
    min-width: 100px;
    height: 32px;
  }

  .icon {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease-in-out;
  }

  .button:hover {
    transform: scale(1.03);
    border-color: #fff9;
  }

  .button:hover .icon {
    transform: translate(3px);
  }

  .button:hover::before {
    animation: shine 1.5s ease-out infinite;
  }

  .button::before {
    content: "";
    position: absolute;
    width: 80px;
    height: 100%;
    background-image: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0) 70%
    );
    top: 0;
    left: -80px;
    opacity: 0.6;
  }

  @keyframes shine {
    0% {
      left: -80px;
    }
    60% {
      left: 100%;
    }
    to {
      left: 100%;
    }
  }
`;

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
    if (type === 'remote') {
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    }
    
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
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">Recommended for you</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-blue-600">
           
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow border border-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-blue-900">{job.title}</CardTitle>
                    <p className="text-sm text-blue-700">{job.company.company_name}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                {job.remote_allowed && (
                  <Badge className={getBadgeStyle('remote', '')}>
                    Remote OK
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
                <Badge className={getBadgeStyle('experience', job.experience_level)}>
                  {job.experience_level}
                </Badge>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3">
                {job.description}
              </p>

              {job.job_skills && job.job_skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.job_skills.slice(0, 3).map((jobSkill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {jobSkill.skill.name}
                    </Badge>
                  ))}
                  {job.job_skills.length > 3 && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
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
                <StyledButton onClick={() => handleApplyClick(job)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="border-blue-50">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-800 mb-2">No jobs available</h3>
            <p className="text-blue-600">Check back later for new opportunities!</p>
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