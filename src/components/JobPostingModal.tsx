import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Briefcase, Globe, MapPin, DollarSign, Award, BarChart2, CheckCircle, Zap, Layers, Code, User, Clock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobPostingModalProps {
  companyId?: string;
  onClose: () => void;
  onJobPosted: () => void;
}

const JobPostingModal = ({ companyId, onClose, onJobPosted }: JobPostingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    employment_type: '',
    salary_min: '',
    salary_max: '',
    skills_required: '',
    experience_level: 'mid',
    remote_allowed: false,
    company_name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCompanyId = companyId;

      if (!finalCompanyId && formData.company_name) {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('company_name', formData.company_name)
          .single();

        if (existingCompany) {
          finalCompanyId = existingCompany.id;
        } else {
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert({
              company_name: formData.company_name,
              profile_id: user?.id
            })
            .select('id')
            .single();

          if (companyError) throw companyError;
          finalCompanyId = newCompany.id;
        }
      }

      if (!finalCompanyId) {
        throw new Error('Company information is required');
      }

      const { error } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          employment_type: formData.employment_type,
          experience_level: formData.experience_level,
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
          remote_allowed: formData.remote_allowed,
          company_id: finalCompanyId,
          is_active: true,
          status: 'active'
        });

      if (error) throw error;

      onJobPosted();
    } catch (error: any) {
      toast({
        title: "Error posting job",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto border-0 shadow-2xl dark:shadow-none dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Create Job Opportunity</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to attract top talent</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!companyId && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  Company
                </label>
                <div className="relative group">
                  <Input
                    name="company_name"
                    placeholder="Enter your company name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                    className="pl-10 py-5 text-base border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Job Title
              </label>
              <div className="relative group">
                <Input
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="py-5 text-base border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Location
                </label>
                <div className="relative group">
                  <Input
                    name="location"
                    placeholder="e.g. San Francisco, CA or 'Remote'"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="pl-10 py-5 text-base border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Employment Type
                </label>
                <Select onValueChange={(value) => handleSelectChange('employment_type', value)}>
                  <SelectTrigger className="py-5 text-base border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800/50">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <SelectItem value="full_time" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span>Full Time</span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Most Common</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="part_time" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        Part Time
                      </div>
                    </SelectItem>
                    <SelectItem value="contract" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-orange-500" />
                        Contract
                      </div>
                    </SelectItem>
                    <SelectItem value="internship" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-yellow-500" />
                        Internship
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  Experience Level
                </label>
                <Select 
                  onValueChange={(value) => handleSelectChange('experience_level', value)} 
                  defaultValue="mid"
                >
                  <SelectTrigger className="py-5 text-base border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800/50">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                    <SelectItem value="entry" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-blue-400" />
                        <div>
                          <span>Entry Level</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">0-2 years experience</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="mid" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-green-400" />
                        <div>
                          <span>Mid Level</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2-5 years experience</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="senior" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-purple-400" />
                        <div>
                          <span>Senior Level</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">5+ years experience</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="lead" className="py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-orange-400" />
                        <div>
                          <span>Lead/Principal</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Leadership experience</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Salary Range (USD)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <Input
                      name="salary_min"
                      type="number"
                      placeholder="Minimum"
                      value={formData.salary_min}
                      onChange={handleInputChange}
                      className="pl-10 py-5 text-base border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="relative group">
                    <Input
                      name="salary_max"
                      type="number"
                      placeholder="Maximum"
                      value={formData.salary_max}
                      onChange={handleInputChange}
                      className="pl-10 py-5 text-base border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remote work available
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check if this position allows remote work</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="remote_allowed"
                  name="remote_allowed"
                  checked={formData.remote_allowed}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-md"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                Job Description
              </label>
              <div className="relative group">
                <Textarea
                  name="description"
                  placeholder="Describe the role in detail. What will the candidate be working on? What makes this position exciting? What impact will they have?"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                  className="text-base p-4 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                />
                <div className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Requirements & Qualifications
              </label>
              <div className="relative group">
                <Textarea
                  name="requirements"
                  placeholder="List the must-have qualifications, skills, and experience. What does the ideal candidate look like?"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className="text-base p-4 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                />
                <div className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Code className="h-4 w-4 text-green-500" />
                Technical Skills
              </label>
              <div className="relative group">
                <Input
                  name="skills_required"
                  placeholder="List required skills (e.g. React, Node.js, TypeScript, AWS). Separate with commas."
                  value={formData.skills_required}
                  onChange={handleInputChange}
                  className="py-5 text-base pl-10 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800/50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <Code className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Opportunity...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Publish Job Listing
                  </span>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="py-6 text-base font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPostingModal;