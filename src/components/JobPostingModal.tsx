import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Briefcase, Globe, MapPin, DollarSign, Award, BarChart2, CheckCircle, Zap, Layers, Code, User, Clock, Shield, Sparkles, Rocket, Palette, Cpu, Database, Server, Smartphone } from 'lucide-react';
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
  const [activeStep, setActiveStep] = useState(1);
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

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="relative w-full max-w-4xl">
        {/* Floating particles background */}
        <div className="absolute -inset-4 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-10"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <Card className="relative w-full max-h-[95vh] overflow-y-auto border-0 shadow-2xl dark:shadow-none dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create Job Opportunity
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activeStep === 1 && "Basic information about the position"}
                    {activeStep === 2 && "Details about requirements and salary"}
                    {activeStep === 3 && "Finalize and publish your listing"}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress steps */}
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700/50 -translate-y-1/2 z-0 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(activeStep - 1) * 50}%` }}
                  ></div>
                </div>
                {[1, 2, 3].map((step) => (
                  <div key={step} className="relative z-10">
                    <button
                      onClick={() => setActiveStep(step)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeStep >= step ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-400'}`}
                    >
                      {step}
                    </button>
                    <div className={`absolute top-full mt-2 text-xs font-medium whitespace-nowrap ${activeStep === step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {step === 1 && 'Basic Info'}
                      {step === 2 && 'Details'}
                      {step === 3 && 'Finalize'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Information */}
              {activeStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  {!companyId && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                          <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Company
                        </span>
                      </label>
                      <div className="relative group">
                        <Input
                          name="company_name"
                          placeholder="Enter your company name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          required
                          className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                          <Award className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
                        <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Job Title
                      </span>
                    </label>
                    <div className="relative group">
                      <Input
                        name="title"
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
                          <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          Location
                        </span>
                      </label>
                      <div className="relative group">
                        <Input
                          name="location"
                          placeholder="e.g. San Francisco, CA or 'Remote'"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                          <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          Employment Type
                        </span>
                      </label>
                      <Select onValueChange={(value) => handleSelectChange('employment_type', value)}>
                        <SelectTrigger className="py-6 text-base border-gray-300/50 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-500 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-xl backdrop-blur-sm">
                          <SelectItem value="full_time" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-blue-500" />
                              <div>
                                <span>Full Time</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Standard employment</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="part_time" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-green-500" />
                              <div>
                                <span>Part Time</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Reduced hours</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="contract" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-orange-500" />
                              <div>
                                <span>Contract</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Fixed-term project</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="internship" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-yellow-500" />
                              <div>
                                <span>Internship</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Temporary position</p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {activeStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          Experience Level
                        </span>
                      </label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('experience_level', value)} 
                        defaultValue="mid"
                      >
                        <SelectTrigger className="py-6 text-base border-gray-300/50 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-500 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-xl backdrop-blur-sm">
                          <SelectItem value="entry" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BarChart2 className="h-5 w-5 text-blue-400" />
                              <div>
                                <span>Entry Level</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">0-2 years experience</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="mid" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BarChart2 className="h-5 w-5 text-green-400" />
                              <div>
                                <span>Mid Level</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2-5 years experience</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="senior" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BarChart2 className="h-5 w-5 text-purple-400" />
                              <div>
                                <span>Senior Level</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">5+ years experience</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="lead" className="py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BarChart2 className="h-5 w-5 text-orange-400" />
                              <div>
                                <span>Lead/Principal</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Leadership experience</p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                          Salary Range (USD)
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <Input
                            name="salary_min"
                            type="number"
                            placeholder="Minimum"
                            value={formData.salary_min}
                            onChange={handleInputChange}
                            className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                          />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
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
                            className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                          />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                            <DollarSign className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-900/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-inner">
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
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 dark:peer-focus:ring-blue-800/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg peer-checked:shadow-blue-500/20"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Finalize */}
              {activeStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                        <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Job Description
                      </span>
                    </label>
                    <div className="relative group">
                      <Textarea
                        name="description"
                        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        required
                        className="pl-12 py-4 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                      />
                      <div className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        <Layers className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30">
                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        Requirements & Qualifications
                      </span>
                    </label>
                    <div className="relative group">
                      <Textarea
                        name="requirements"
                        placeholder="List the must-have qualifications, skills, and experience required..."
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={5}
                        required
                        className="pl-12 py-4 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                      />
                      <div className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        <Shield className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                        <Code className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Technical Skills
                      </span>
                    </label>
                    <div className="relative group">
                      <Input
                        name="skills_required"
                        placeholder="List required skills (e.g. React, Node.js, TypeScript, AWS). Separate with commas."
                        value={formData.skills_required}
                        onChange={handleInputChange}
                        className="pl-12 py-6 text-base border-gray-300/50 dark:border-gray-600/50 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        <Code className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Tech stack selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                        <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        Tech Stack (Optional)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {[
                        { icon: <Smartphone className="h-5 w-5" />, label: 'Mobile' },
                        { icon: <Globe className="h-5 w-5" />, label: 'Web' },
                        { icon: <Database className="h-5 w-5" />, label: 'Database' },
                        { icon: <Server className="h-5 w-5" />, label: 'Backend' },
                        { icon: <Palette className="h-5 w-5" />, label: 'Design' },
                        { icon: <Code className="h-5 w-5" />, label: 'Frontend' },
                        { icon: <Cpu className="h-5 w-5" />, label: 'AI/ML' },
                        { icon: <Shield className="h-5 w-5" />, label: 'DevOps' }
                      ].map((tech, i) => (
                        <button
                          key={i}
                          type="button"
                          className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-gray-800/30 border border-gray-300/50 dark:border-gray-600/50 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                        >
                          <span className="text-blue-500 dark:text-blue-400">{tech.icon}</span>
                          <span className="text-sm font-medium">{tech.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                {activeStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="flex-1 py-6 text-base font-medium border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-gray-400/50 dark:hover:border-gray-500/50 transition-colors duration-300 rounded-xl"
                  >
                    Back
                  </Button>
                )}
                
                {activeStep < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
                  >
                    Continue
                    <Rocket className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Publish Job Listing
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default JobPostingModal;