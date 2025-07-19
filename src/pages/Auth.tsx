import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Building, User, Loader2, Lock, Mail, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    role: '',
    companyName: '',
    position: ''
  });
  const [showCompanyFields, setShowCompanyFields] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect based on role
  useEffect(() => {
    if (user && !loading) {
      const checkUserRole = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'company_employee') {
          navigate('/company-dashboard');
        } else {
          navigate('/');
        }
      };
      
      checkUserRole();
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
    setShowCompanyFields(role === 'company_employee');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(formData.email, formData.password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'company_employee' && (!formData.companyName || !formData.position)) {
      toast({
        title: "Missing company information",
        description: "Please enter your company name and position",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName, {
        role: formData.role,
        companyName: formData.companyName,
        position: formData.position
      });

      if (!error && formData.role === 'company_employee') {
        toast({
          title: "Company Employee Account Created",
          description: "Please check your email and then contact your company admin to complete setup.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-blue-600" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Preparing your experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
              <BarChart3 className="text-white h-10 w-10" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
          >
            SkillMatrix
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            {activeTab === 'signin' ? 'Welcome back to your professional network' : 'Join our community of professionals'}
          </motion.p>
        </motion.div>

        {/* Auth Card */}
        <motion.div whileHover={{ y: -5 }}>
          <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-850 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Tabs 
                defaultValue="signin" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 h-12">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white rounded-lg py-2 transition-all duration-300 font-medium"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-black-700 dark:data-[state=active]:text-white rounded-lg py-2 transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                {/* Sign In Form */}
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="flex items-center justify-center">
                            <span>Sign In</span>
                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
                
                {/* Sign Up Form */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="email"
                          name="email"
                          id="signup-email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    
                    {/* Role Selection */}
                    <div className="space-y-2">
  <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
    I am a...
  </label>
  <Select onValueChange={handleRoleChange}>
    <SelectTrigger className="w-full py-3 pl-10 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all text-left">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

      </div>
      <SelectValue 
        placeholder="Select your role"
        className="text-gray-900 dark:text-gray-300"
      />
      <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
    </SelectTrigger>
    <SelectContent className="rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full">
      <SelectItem 
        value="candidate" 
        className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
      >
        <div className="flex items-center gap-3 w-full">

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Job Candidate</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Looking for opportunities</p>
          </div>
        </div>
      </SelectItem>
      <SelectItem 
        value="company_employee" 
        className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
      >
        <div className="flex items-center gap-3 w-full">

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Company Employee</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Hiring or managing talent</p>
          </div>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</div>

                    {/* Company Fields for Company Employees */}
                    <AnimatePresence>
                      {showCompanyFields && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6 overflow-hidden"
                        >
                          <div className="space-y-2">
                            <label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Company name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input
                                type="text"
                                name="companyName"
                                id="companyName"
                                placeholder="Your company name"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                required={showCompanyFields}
                                className="w-full py-3 pl-10 pr-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="position" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Your position
                            </label>
                            <Input
                              type="text"
                              name="position"
                              id="position"
                              placeholder="e.g. HR Manager"
                              value={formData.position}
                              onChange={handleInputChange}
                              required={showCompanyFields}
                              className="w-full py-3 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="signup-password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full py-3 pl-10 pr-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all placeholder:text-gray-900 dark:placeholder:text-gray-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="flex items-center justify-center">
                            <span>Create Account</span>
                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms</a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;