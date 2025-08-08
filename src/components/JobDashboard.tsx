import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, Building, Plus, Search, ArrowRight, Star, Zap, Briefcase, ChevronRight, Heart, Share2, BarChart2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import JobApplicationModal from './JobApplicationModal';
import JobPostingModal from './JobPostingModal';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteJobs');
    if (savedFavorites) {
      setFavoriteJobs(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs));
  }, [favoriteJobs]);

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
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20';
    }
    
    if (type === 'experience') {
      switch (value.toLowerCase()) {
        case 'entry':
          return 'bg-sky-500/10 text-sky-600 border-sky-500/20 hover:bg-sky-500/20';
        case 'mid':
          return 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20';
        case 'senior':
          return 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20';
        case 'lead':
          return 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20';
        default:
          return 'bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20';
      }
    }
    
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20';
  };

  const toggleFavorite = (jobId: string) => {
    if (favoriteJobs.includes(jobId)) {
      setFavoriteJobs(favoriteJobs.filter(id => id !== jobId));
    } else {
      setFavoriteJobs([...favoriteJobs, jobId]);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.job_skills.some(skill => skill.skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'remote' && job.remote_allowed) ||
                         (activeFilter === 'entry' && job.experience_level.toLowerCase() === 'entry') ||
                         (activeFilter === 'senior' && job.experience_level.toLowerCase() === 'senior');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          ></motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg font-medium text-blue-600"
          >
            Loading opportunities...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-75 p-4 md:p-8">
     

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-24 pb-16">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Discover Your Dream Job
            </span>
            <br />
            <span className="text-gray-800">With Top Tech Companies</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            Join thousands of professionals who've found their perfect match through our curated job platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative max-w-2xl mx-auto"
          >
            
           
            
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'ghost'} 
                className={`rounded-full ${activeFilter === 'all' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100/50'}`}
                onClick={() => setActiveFilter('all')}
              >
                All Jobs
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant={activeFilter === 'remote' ? 'default' : 'ghost'} 
                className={`rounded-full ${activeFilter === 'remote' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100/50'}`}
                onClick={() => setActiveFilter('remote')}
              >
                Remote
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant={activeFilter === 'entry' ? 'default' : 'ghost'} 
                className={`rounded-full ${activeFilter === 'entry' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100/50'}`}
                onClick={() => setActiveFilter('entry')}
              >
                Entry Level
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant={activeFilter === 'senior' ? 'default' : 'ghost'} 
                className={`rounded-full ${activeFilter === 'senior' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100/50'}`}
                onClick={() => setActiveFilter('senior')}
              >
                Senior
              </Button>
            </motion.div>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
          </div>
        </div>

        {/* Featured Jobs Banner */}


        {/* Jobs Grid */}
        <AnimatePresence>
          {filteredJobs.length > 0 ? (
            <motion.div 
              layout
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    {/* Premium badge */}
                    {Math.random() > 0.7 && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">

                          Premium
                        </div>
                      </div>
                    )}
                    
                    {/* Favorite button */}
                   
                    
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                              {job.company.logo_url ? (
                                <img src={job.company.logo_url} alt={job.company.company_name} className="h-8 w-8 object-contain" />
                              ) : (
                                <Building className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                            {job.remote_allowed && (
                              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{job.company.company_name}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={getBadgeStyle('experience', job.experience_level)}>
                          {job.experience_level}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                          {job.job_type}
                        </Badge>
                        {job.remote_allowed && (
                          <Badge className={getBadgeStyle('remote', '')}>
                            Remote Available
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1.5 text-green-500" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-3">
                        {job.description}
                      </p>

                      {job.job_skills && job.job_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.job_skills.slice(0, 4).map((jobSkill, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs bg-white border-blue-100 text-blue-600 hover:bg-blue-50"
                            >
                              {jobSkill.skill.name}
                            </Badge>
                          ))}
                          {job.job_skills.length > 4 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-white border-blue-100 text-blue-600 hover:bg-blue-50"
                            >
                              +{job.job_skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-full text-gray-500 hover:bg-gray-100"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleApplyClick(job)}
                            size="sm"
                            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/30"
                          >
                            Apply Now <ArrowRight className="ml-1.5 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="text-center py-16">
                  <div className="mx-auto max-w-md">
                    <Briefcase className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No matching jobs found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 
                        `We couldn't find any jobs matching "${searchQuery}". Try different keywords.` : 
                        "There are currently no jobs available that match your filters."}
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      {filteredJobs.length > 0 && (
        <div className="max-w-7xl mx-auto mt-16 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
            <div className="relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to take the next step in your career?</h2>
                <p className="text-lg text-blue-100 mb-8">
                  Join thousands of professionals who've found their dream jobs through our platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-full px-8 shadow-lg"
                    onClick={() => setJobPostingModalOpen(true)}
                  >
                    Post a Job <Plus className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8"
                  >
                    Browse Candidates
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
    

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