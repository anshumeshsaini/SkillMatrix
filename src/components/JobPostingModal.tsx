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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Floating decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100/30 blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-100/30 blur-xl"></div>
          
          {/* Header */}
          <div className="px-8 pt-6 pb-4 border-b border-white/20 bg-gradient-to-r from-blue-100/30 to-cyan-100/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white shadow-md">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Create Job Opportunity</h2>
                  <p className="text-sm text-gray-600">Fill in the details to attract top talent</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!companyId && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    Company
                  </label>
                  <div className="relative">
                    <Input
                      name="company_name"
                      placeholder="Enter your company name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Job Title
                </label>
                <div className="relative">
                  <Input
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-500">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Location
                  </label>
                  <div className="relative">
                    <Input
                      name="location"
                      placeholder="e.g. San Francisco, CA or 'Remote'"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Employment Type
                  </label>
                  <Select onValueChange={(value) => handleSelectChange('employment_type', value)}>
                    <SelectTrigger className="pl-12 py-4 text-base border border-white/30 bg-white/50 hover:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-white/30 rounded-xl shadow-lg mt-1">
                      <SelectItem value="full_time" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-blue-500" />
                          <div>
                            <span>Full Time</span>
                            <p className="text-xs text-gray-500">Standard employment</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="part_time" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-green-500" />
                          <div>
                            <span>Part Time</span>
                            <p className="text-xs text-gray-500">Reduced hours</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="contract" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-orange-500" />
                          <div>
                            <span>Contract</span>
                            <p className="text-xs text-gray-500">Fixed-term engagement</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="internship" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-yellow-500" />
                          <div>
                            <span>Internship</span>
                            <p className="text-xs text-gray-500">Temporary position</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-500" />
                    Experience Level
                  </label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('experience_level', value)} 
                    defaultValue="mid"
                  >
                    <SelectTrigger className="pl-12 py-4 text-base border border-white/30 bg-white/50 hover:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-white/30 rounded-xl shadow-lg mt-1">
                      <SelectItem value="entry" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BarChart2 className="h-5 w-5 text-blue-400" />
                          <div>
                            <span>Entry Level</span>
                            <p className="text-xs text-gray-500">0-2 years experience</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="mid" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BarChart2 className="h-5 w-5 text-green-400" />
                          <div>
                            <span>Mid Level</span>
                            <p className="text-xs text-gray-500">2-5 years experience</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="senior" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BarChart2 className="h-5 w-5 text-purple-400" />
                          <div>
                            <span>Senior Level</span>
                            <p className="text-xs text-gray-500">5+ years experience</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="lead" className="py-3 hover:bg-blue-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BarChart2 className="h-5 w-5 text-orange-400" />
                          <div>
                            <span>Lead/Principal</span>
                            <p className="text-xs text-gray-500">Leadership experience</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Salary Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        name="salary_min"
                        type="number"
                        placeholder="Minimum"
                        value={formData.salary_min}
                        onChange={handleInputChange}
                        className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-green-500">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        name="salary_max"
                        type="number"
                        placeholder="Maximum"
                        value={formData.salary_max}
                        onChange={handleInputChange}
                        className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-green-500">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-white/30 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-white shadow-sm">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Remote Work Availability</h3>
                      <p className="text-sm text-gray-600">Check if this position allows remote work</p>
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
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500 shadow-inner"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  Job Description
                </label>
                <div className="relative">
                  <Textarea
                    name="description"
                    placeholder="Describe the role, responsibilities, and impact of this position..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                  />
                  <div className="absolute top-4 left-4 text-blue-500">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Requirements & Qualifications
                </label>
                <div className="relative">
                  <Textarea
                    name="requirements"
                    placeholder="List the required qualifications, skills, and experience..."
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                  />
                  <div className="absolute top-4 left-4 text-purple-500">
                    <Shield className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-500" />
                  Technical Skills
                </label>
                <div className="relative">
                  <Input
                    name="skills_required"
                    placeholder="List required skills (e.g. React, Node.js, TypeScript, AWS). Separate with commas."
                    value={formData.skills_required}
                    onChange={handleInputChange}
                    className="pl-12 py-4 text-base border border-white/30 bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm rounded-xl"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-green-500">
                    <Code className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/20">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-5 text-base font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
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
                  className="py-5 text-base font-medium border-white/30 hover:bg-white/50 hover:border-white/40 transition-colors duration-200 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingModal;