import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X, User, Briefcase, Code, Globe, Phone, Link, Github, Linkedin, Calendar, DollarSign, MapPin, Clock, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  role: string;
}

interface Candidate {
  experience_years: number;
  salary_expectation: number | null;
  availability_status: string;
  preferred_job_type: string;
  preferred_location: string | null;
  remote_preference: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [candidateSkills, setCandidateSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSkills();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (profileData?.role === 'candidate') {
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', user?.id)
          .maybeSingle();

        if (candidateData) {
          setCandidate(candidateData);
        }

        const { data: skillsData, error: skillsError } = await supabase
          .from('candidate_skills')
          .select(`
            *,
            skills (name, category)
          `)
          .eq('candidate_id', user?.id);

        if (skillsData) {
          setCandidateSkills(skillsData);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCandidateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('candidates')
        .insert({
          id: user?.id,
          experience_years: 0,
          availability_status: 'open',
          preferred_job_type: 'full_time',
          remote_preference: false
        });

      if (error) throw error;

      toast({
        title: "Candidate profile created",
        description: "Your candidate profile has been created successfully."
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error creating candidate profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (updates: Partial<Candidate>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Candidate profile updated",
        description: "Your candidate profile has been updated successfully."
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error updating candidate profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const skill = skills.find(s => s.name.toLowerCase() === newSkill.toLowerCase());
      if (!skill) {
        toast({
          title: "Skill not found",
          description: "Please select a skill from the available list.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('candidate_skills')
        .insert({
          candidate_id: user?.id,
          skill_id: skill.id,
          proficiency_level: 3,
          years_experience: 1
        });

      if (error) throw error;

      setNewSkill('');
      fetchProfile();
      
      toast({
        title: "Skill added",
        description: "Skill has been added to your profile."
      });
    } catch (error: any) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('candidate_skills')
        .delete()
        .eq('candidate_id', user?.id)
        .eq('skill_id', skillId);

      if (error) throw error;

      fetchProfile();
      
      toast({
        title: "Skill removed",
        description: "Skill has been removed from your profile."
      });
    } catch (error: any) {
      toast({
        title: "Error removing skill",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border border-blue-200">
                {profile.full_name ? profile.full_name.charAt(0) : 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">
                {profile.full_name || 'Your Profile'}
              </h1>
              <p className="text-blue-600 flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                {profile.role === 'candidate' ? 'Candidate' : 'User'}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl">
            {profile.bio || "Complete your profile to showcase your skills and experience to potential employers."}
          </p>
        </motion.div>

        <Tabs 
          defaultValue="general" 
          className="space-y-8"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 py-3 px-6 rounded-xl transition-all border border-gray-200"
              >
                <User className="h-5 w-5 mr-2" />
                General
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger 
                value="candidate" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 py-3 px-6 rounded-xl transition-all border border-gray-200"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Candidate Info
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 py-3 px-6 rounded-xl transition-all border border-gray-200"
              >
                <Code className="h-5 w-5 mr-2" />
                Skills
              </TabsTrigger>
            </motion.div>
          </TabsList>

          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-black">
                        General Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Update your basic profile information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        Full Name
                      </label>
                      <Input
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        Email
                      </label>
                      <Input 
                        value={profile.email} 
                        disabled 
                        className="rounded-lg bg-gray-50 text-gray-700 border-gray-300"
                        placeholder="Your email address"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-500" />
                      Bio
                    </label>
                    <Textarea
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        Location
                      </label>
                      <Input
                        value={profile.location || ''}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        placeholder="City, Country"
                        className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        Phone
                      </label>
                      <Input
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-500" />
                        LinkedIn URL
                      </label>
                      <Input
                        value={profile.linkedin_url || ''}
                        onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                        className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Github className="h-4 w-4 mr-2 text-blue-500" />
                        GitHub URL
                      </label>
                      <Input
                        value={profile.github_url || ''}
                        onChange={(e) => setProfile({...profile, github_url: e.target.value})}
                        placeholder="https://github.com/username"
                        className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={() => updateProfile(profile)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 shadow-md transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="candidate">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-black">
                        Candidate Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {!candidate ? "Create your candidate profile" : "Update your professional details"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {!candidate ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                        <Briefcase className="h-10 w-10 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-black">
                        You haven't created a candidate profile yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Create your candidate profile to showcase your skills and experience to potential employers.
                      </p>
                      <div className="pt-4">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button 
                            onClick={createCandidateProfile}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 shadow-md transition-all"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Candidate Profile
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            Years of Experience
                          </label>
                          <Input
                            type="number"
                            value={candidate.experience_years || 0}
                            onChange={(e) => setCandidate({...candidate, experience_years: parseInt(e.target.value) || 0})}
                            className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter years of experience"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                            Salary Expectation (USD)
                          </label>
                          <Input
                            type="number"
                            value={candidate.salary_expectation || ''}
                            onChange={(e) => setCandidate({...candidate, salary_expectation: parseInt(e.target.value) || null})}
                            placeholder="Enter expected salary"
                            className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            Availability Status
                          </label>
                          <Select
                            value={candidate.availability_status}
                            onValueChange={(value) => setCandidate({...candidate, availability_status: value})}
                          >
                            <SelectTrigger className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg border-gray-200 bg-white">
                              <SelectItem value="open" className="hover:bg-blue-50">
                                Open to opportunities
                              </SelectItem>
                              <SelectItem value="interviewing" className="hover:bg-blue-50">
                                Currently interviewing
                              </SelectItem>
                              <SelectItem value="not_available" className="hover:bg-blue-50">
                                Not available
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                            Preferred Job Type
                          </label>
                          <Select
                            value={candidate.preferred_job_type}
                            onValueChange={(value) => setCandidate({...candidate, preferred_job_type: value})}
                          >
                            <SelectTrigger className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg border-gray-200 bg-white">
                              <SelectItem value="full_time" className="hover:bg-blue-50">
                                Full-time
                              </SelectItem>
                              <SelectItem value="part_time" className="hover:bg-blue-50">
                                Part-time
                              </SelectItem>
                              <SelectItem value="contract" className="hover:bg-blue-50">
                                Contract
                              </SelectItem>
                              <SelectItem value="freelance" className="hover:bg-blue-50">
                                Freelance
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          Preferred Location
                        </label>
                        <Input
                          value={candidate.preferred_location || ''}
                          onChange={(e) => setCandidate({...candidate, preferred_location: e.target.value})}
                          placeholder="Enter preferred location"
                          className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="remote"
                          checked={candidate.remote_preference}
                          onChange={(e) => setCandidate({...candidate, remote_preference: e.target.checked})}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                          Open to remote work
                        </label>
                      </div>

                      <div className="flex justify-end pt-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => updateCandidate(candidate)}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 shadow-md transition-all"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="skills">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-black">
                        Skills
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Add skills to showcase your expertise
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Search and add skills..."
                      list="skills-list"
                      className="rounded-lg border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 flex-1"
                    />
                    <datalist id="skills-list">
                      {skills.map(skill => (
                        <option key={skill.id} value={skill.name} />
                      ))}
                    </datalist>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={addSkill} 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 shadow-md"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>

                  {candidateSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {candidateSkills.map((candidateSkill) => (
                        <motion.div
                          key={candidateSkill.id}
                          whileHover={{ scale: 1.03 }}
                          className="relative"
                        >
                          <Badge
                            variant="secondary"
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm"
                          >
                            <span className="text-gray-800">
                              {candidateSkill.skills.name}
                            </span>
                            <button
                              onClick={() => removeSkill(candidateSkill.skill_id)}
                              className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <Code className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-gray-500">
                        No skills added yet. Start by adding your first skill above.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;