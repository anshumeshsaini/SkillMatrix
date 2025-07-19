import React, { useState } from 'react';
import DashboardStats from './DashboardStats';
import JobDashboard from './JobDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Plus, Rocket, User, Briefcase, Settings, Bell, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobPostingModal from './JobPostingModal';
import Footer from './Footer';
import PlacementGuaranteeCourses from './PlacementGuaranteeCourses';

const CertificationWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  const toggleWidget = () => {
    setExpanded(!expanded);
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 2000);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${highlighted ? 'animate-float' : ''}`}>
      {/* Collapsed Widget */}
      {!expanded && (
        <div 
          onClick={toggleWidget}
          className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-blue-100/50 cursor-pointer hover:shadow-3xl transition-all flex items-center space-x-3 group hover:scale-105 transform-gpu"
          style={{
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl shadow-inner">
            <BookOpen className="w-6 h-6 text-gradient bg-gradient-to-r from-blue-600 to-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">SkillMaster</h3>
            <p className="text-sm text-gray-500">Certification courses</p>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-y-0.5" />
        </div>
      )}

      {/* Expanded Widget */}
      {expanded && (
        <div 
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-3xl border border-blue-100/30 overflow-hidden w-80 transition-all duration-500 transform-gpu"
          style={{
            boxShadow: '0 20px 50px -10px rgba(59, 130, 246, 0.3)'
          }}
        >
          {/* Widget Header */}
          <div 
            onClick={toggleWidget}
            className="p-4 border-b border-blue-50/50 flex items-center justify-between cursor-pointer hover:bg-blue-50/30 transition-colors duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg shadow-inner">
                <BookOpen className="w-5 h-5 text-gradient bg-gradient-to-r from-blue-600 to-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800">SkillMaster Certifications</h3>
            </div>
            <ChevronUp className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors duration-300" />
          </div>
          
          {/* Widget Content */}
          <div className="p-5 space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Master the in-demand skills</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get govt.-accredited certification courses and level-up your resume with our industry-recognized programs.
            </p>
            
            <div className="pt-2">
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02] transform-gpu active:scale-95"
                onClick={() => {
                  const element = document.getElementById('certification-courses');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    element.classList.add('animate-pulse', 'ring-2', 'ring-blue-500');
                    setTimeout(() => {
                      element.classList.remove('animate-pulse', 'ring-2', 'ring-blue-500');
                    }, 3000);
                  }
                }}
                style={{
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)'
                }}
              >
                <span className="font-medium">Explore Courses</span>
                <Rocket className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);

  const handleJobPosted = () => {
    setJobPostingModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
      {/* Animated Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl animate-float-slow"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#4F46E5" d="M45,-78.9C58.4,-71.5,69.6,-60.1,78.2,-46.3C86.8,-32.5,92.7,-16.3,92.6,-0.1C92.5,16.1,86.4,32.2,77.2,46.3C68,60.4,55.8,72.5,41.1,79.7C26.4,86.9,9.2,89.2,-7.5,88.7C-24.2,88.2,-48.4,84.9,-63.7,74.4C-79,63.9,-85.4,46.2,-87.1,28.8C-88.8,11.4,-85.8,-5.7,-79.1,-20.9C-72.4,-36.1,-62,-49.4,-48.8,-57C-35.6,-64.6,-19.6,-66.5,-2.4,-63.3C14.9,-60.1,29.8,-51.8,45,-78.9Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full relative z-10">
        {/* Glassmorphic Header with 3D effect */}
        <div 
          className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden transform-gpu hover:shadow-3xl transition-all duration-500"
          style={{
            boxShadow: '0 20px 50px -10px rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-tr-full -ml-10 -mb-10"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                Welcome Back, <br className="sm:hidden" /><span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-700">User!</span>
              </h1>
              <p className="text-blue-600/80 font-medium flex items-center text-lg">
                <Rocket className="w-5 h-5 mr-2 animate-bounce" />
                Jobs tailored to your skills and preferences
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-800 shadow-xs border border-white/50 backdrop-blur-sm">

                Premium Plan
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white/80 text-blue-800 border border-blue-100/50 shadow-xs backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                +12% growth
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview with Animated Cards */}
        <DashboardStats />

        {/* Job Dashboard Section with Floating Effect */}
        <div className="relative group transform-gpu hover:-translate-y-1 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-3xl -z-10 transition-all duration-500 group-hover:opacity-80 blur-xl"></div>
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-2xl"
            style={{
              boxShadow: '0 15px 40px -10px rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Job Dashboard
                  </span>
                </h2>
                <Button 
                  onClick={() => setJobPostingModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300 flex items-center group transform-gpu hover:scale-[1.02] active:scale-95"
                  style={{
                    boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.3)'
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Post a Job
                </Button>
              </div>
              <JobDashboard />
            </div>
          </div>
        </div>

        {/* Certification Courses Section */}
        <div 
          id="certification-courses" 
          className="transition-all duration-500 transform-gpu hover:-translate-y-1"
        >
          <PlacementGuaranteeCourses />
        </div>

        {/* Certification Widget */}
        <CertificationWidget />

        {jobPostingModalOpen && (
          <JobPostingModal
            onClose={() => setJobPostingModalOpen(false)}
            onJobPosted={handleJobPosted}
          />
        )}
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shadow-soft-xl {
          box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.1);
        }
        .shadow-soft-2xl {
          box-shadow: 0 20px 50px -10px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;