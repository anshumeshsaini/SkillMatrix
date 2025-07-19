import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, ChevronDown, ChevronUp, Star, MapPin, Briefcase, CircleDot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Candidate {
  id: string;
  profiles: {
    full_name: string;
    email: string;
    location: string;
    avatar_url?: string;
  };
  experience_years: number;
  availability_status: string;
}

interface CandidateSkill {
  skill_id: string;
  proficiency_level: number;
  years_experience: number;
  skills: {
    name: string;
    category: string;
  };
}

const DynamicSkillMatrix = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateSkills, setCandidateSkills] = useState<Record<string, CandidateSkill[]>>({});
  const [skills, setSkills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select(`
          id,
          experience_years,
          availability_status,
          profiles (
            full_name,
            email,
            location,
            avatar_url
          )
        `)
        .eq('availability_status', 'open');

      if (candidatesError) throw candidatesError;

      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (skillsError) throw skillsError;

      const { data: candidateSkillsData, error: candidateSkillsError } = await supabase
        .from('candidate_skills')
        .select(`
          candidate_id,
          skill_id,
          proficiency_level,
          years_experience,
          skills (
            name,
            category
          )
        `);

      if (candidateSkillsError) throw candidateSkillsError;

      const skillsByCandidate: Record<string, CandidateSkill[]> = {};
      candidateSkillsData?.forEach(skill => {
        if (!skillsByCandidate[skill.candidate_id]) {
          skillsByCandidate[skill.candidate_id] = [];
        }
        skillsByCandidate[skill.candidate_id].push(skill);
      });

      setCandidates(candidatesData || []);
      setSkills(skillsData || []);
      setCandidateSkills(skillsByCandidate);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillCategories = () => {
    const categories = [...new Set(skills.map(skill => skill.category))];
    return ['all', ...categories];
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidateSkills[candidate.id]?.some(skill => 
        skill.skills.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory === 'all' || 
      candidateSkills[candidate.id]?.some(skill => 
        skill.skills.category === selectedCategory
      );

    return matchesSearch && matchesCategory;
  });

  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-blue-50 border-blue-100 text-blue-800'; // Beginner
      case 2: return 'bg-blue-100 border-blue-200 text-blue-800'; // Basic
      case 3: return 'bg-blue-200 border-blue-300 text-blue-900'; // Intermediate
      case 4: return 'bg-blue-300 border-blue-400 text-blue-900'; // Advanced
      case 5: return 'bg-blue-500 border-blue-600 text-white';    // Expert
      default: return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  const toggleCandidateExpansion = (id: string) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-blue-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-800">Talent Skill Matrix</h2>
            <p className="text-sm text-blue-600">
              Interactive visualization of candidates and their skill proficiencies
            </p>
          </div>
        </div>

        {/* Proficiency Level Legend */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Proficiency Levels:</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(level)}`}
              >
                {getProficiencyLabel(level)}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Search candidates or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-blue-100"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white border-blue-100">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-blue-500" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-100">
                {getSkillCategories().map(category => (
                  <SelectItem key={category} value={category} className="hover:bg-blue-50">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="space-y-3">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-8 text-blue-600">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No candidates found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border border-blue-100 rounded-lg overflow-hidden transition-all"
              >
                <div 
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => toggleCandidateExpansion(candidate.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {candidate.profiles?.avatar_url ? (
                        <img 
                          src={candidate.profiles.avatar_url} 
                          alt={candidate.profiles.full_name}
                          className="h-10 w-10 rounded-full object-cover border border-blue-100"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {candidate.profiles?.full_name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-blue-800">
                          {candidate.profiles?.full_name || 'Anonymous'}
                        </h3>
                        <div className="flex items-center text-sm text-blue-600 space-x-2">
                          <span className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {candidate.experience_years} yrs
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {candidate.profiles?.location || 'Remote'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={candidate.availability_status === 'open' ? 'default' : 'secondary'}
                        className={`${candidate.availability_status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-800'}`}
                      >
                        {candidate.availability_status}
                      </Badge>
                      {expandedCandidate === candidate.id ? (
                        <ChevronUp className="h-4 w-4 text-blue-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedCandidate === candidate.id && (
                  <div className="border-t border-blue-100 p-4 bg-blue-50">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <CircleDot className="h-3 w-3 mr-2 text-blue-600" />
                        Contact Information
                      </h4>
                      <p className="text-sm text-blue-600">
                        {candidate.profiles?.email || 'No email provided'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <Star className="h-3 w-3 mr-2 text-blue-600" />
                        Skills & Proficiencies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {candidateSkills[candidate.id]?.length > 0 ? (
                          candidateSkills[candidate.id]?.map((skill) => (
                            <div
                              key={skill.skill_id}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(skill.proficiency_level)}`}
                            >
                              {skill.skills.name} • {getProficiencyLabel(skill.proficiency_level)}
                              {skill.years_experience > 0 && ` • ${skill.years_experience}y`}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-blue-500 italic">No skills listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicSkillMatrix;