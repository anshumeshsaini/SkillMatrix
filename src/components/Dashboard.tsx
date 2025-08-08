import React, { useState, useRef, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import JobDashboard from './JobDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Plus, Rocket, User, Briefcase, Settings, Bell, BookOpen, ChevronDown, ChevronUp, Search, BarChart2, Globe, Shield, Zap, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobPostingModal from './JobPostingModal';
import Footer from './Footer';
import PlacementGuaranteeCourses from './PlacementGuaranteeCourses';
import Lottie from 'lottie-react';
import animationData from './animations/confetti.json';
import waveAnimation from './animations/Wave.json';
import notificationAnimation from './animations/Notification-bell.json';
import successAnimation from './animations/sucess-check.json';
import particleAnimation from './animations/Particlees.json';

const CertificationWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const lottieRef = useRef(null);

  const toggleWidget = () => {
    setExpanded(!expanded);
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 2000);
    
    if (!expanded && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${highlighted ? 'animate-float' : ''}`}>
      {!expanded && (
        <div 
          onClick={toggleWidget}
          className="bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-full p-5 shadow-2xl cursor-pointer hover:shadow-3xl transition-all flex items-center space-x-3 group hover:scale-105 transform-gpu backdrop-blur-md border border-white/20"
          style={{
            boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.5)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="relative">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/10">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-white shadow-lg border-2 border-white animate-pulse">
              <Lottie 
                animationData={notificationAnimation}
                loop={false}
                autoplay={true}
                style={{ width: 20, height: 20 }}
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide">SkillMaster Pro</h3>
            <p className="text-xs text-white/80 font-light">Certification courses</p>
          </div>
          <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
        </div>
      )}

      {expanded && (
        <div 
          className="bg-gradient-to-br from-cyan-500/90 via-blue-600/90 to-indigo-700/90 rounded-3xl shadow-3xl overflow-hidden w-96 transition-all duration-500 transform-gpu backdrop-blur-md border border-white/20"
          style={{
            boxShadow: '0 25px 60px -15px rgba(16, 185, 129, 0.6)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div 
            onClick={toggleWidget}
            className="p-5 border-b border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/10">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white tracking-wide">SkillMaster Certifications</h3>
            </div>
            <ChevronUp className="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300 relative z-10" />
          </div>
          
          <div className="p-6 space-y-5 relative">
            <Lottie
              lottieRef={lottieRef}
              animationData={successAnimation}
              loop={false}
              autoplay={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.15
              }}
            />
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold text-white tracking-wide">Master in-demand skills</h4>
              <p className="text-white/90 text-sm leading-relaxed font-light">
                Get government-accredited certification courses and level-up your resume with our industry-recognized programs.
              </p>
              
              <div className="pt-2">
                <button 
                  className="w-full bg-white text-cyan-600 py-3 px-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02] transform-gpu active:scale-95 font-medium tracking-wide"
                  onClick={() => {
                    const element = document.getElementById('certification-courses');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      element.classList.add('animate-pulse', 'ring-2', 'ring-white');
                      setTimeout(() => {
                        element.classList.remove('animate-pulse', 'ring-2', 'ring-white');
                      }, 3000);
                    }
                  }}
                  style={{
                    boxShadow: '0 6px 20px 0 rgba(255, 255, 255, 0.4)'
                  }}
                >
                  <span>Explore Courses</span>
                  <Rocket className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const confettiRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    if (particleRef.current) {
      particleRef.current.setSpeed(0.5);
    }
  }, []);

  const handleJobPosted = () => {
    setJobPostingModalOpen(false);
    setShowConfetti(true);
    if (confettiRef.current) {
      confettiRef.current.play();
    }
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const QuickActions = () => {
    const actions = [
      { 
        icon: <Briefcase className="w-5 h-5 text-cyan-600" />, 
        label: "Post Job", 
        action: () => setJobPostingModalOpen(true),
        gradient: "from-cyan-100/90 to-blue-200/90"
      },
      { 
        icon: <User className="w-5 h-5 text-indigo-600" />, 
        label: "Profile", 
        action: () => {},
        gradient: "from-indigo-100/90 to-purple-200/90"
      },
      { 
        icon: <Settings className="w-5 h-5 text-blue-600" />, 
        label: "Settings", 
        action: () => {},
        gradient: "from-blue-100/90 to-cyan-200/90"
      },
    ];

    return (
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`bg-gradient-to-br ${action.gradient} rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all duration-300 border border-white/30 backdrop-blur-sm transform-gpu hover:-translate-y-1 hover:scale-105`}
          >
            <div className="bg-white p-2 rounded-lg shadow-xs">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 tracking-wide">{action.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const RecentActivity = () => {
    const activities = [
      { 
        icon: <Zap className="w-4 h-4 text-amber-500" />, 
        title: "New job match", 
        description: "Senior UX Designer at TechCorp", 
        time: "2 mins ago",
        color: "bg-amber-100/80"
      },
      { 
        icon: <Clock className="w-4 h-4 text-blue-500" />, 
        title: "Interview scheduled", 
        description: "Product Manager at Innovate Inc.", 
        time: "1 hour ago",
        color: "bg-blue-100/80"
      },
      { 
        icon: <Calendar className="w-4 h-4 text-indigo-500" />, 
        title: "Application deadline", 
        description: "Frontend Developer role closes tomorrow", 
        time: "3 hours ago",
        color: "bg-indigo-100/80"
      },
    ];

    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 tracking-wide">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className={`flex items-start space-x-3 p-3 ${activity.color} rounded-xl hover:bg-white transition-colors duration-200 backdrop-blur-sm border border-white/30`}>
              <div className="bg-white p-2 rounded-lg shadow-xs">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 tracking-wide">{activity.title}</h4>
                <p className="text-sm text-gray-600 font-light">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap font-light">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/50 via-blue-50/50 to-cyan-50/50 overflow-hidden relative">
      {/* Particle Animation Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
       
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Lottie
            lottieRef={confettiRef}
            animationData={animationData}
            loop={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Futuristic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-200/10 blur-3xl animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-indigo-200/10 blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 rounded-full bg-blue-200/10 blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-cyan-300/5 blur-2xl animate-float-fast"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-xl opacity-70"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-400/5 to-purple-500/5 rounded-full blur-xl opacity-70"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-cyan-500/5 rounded-full blur-xl opacity-70"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full relative z-10">
        {/* Hero Section - Futuristic Glass Morphism */}
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden transform-gpu hover:shadow-3xl transition-all duration-500 group"
          style={{
            boxShadow: '0 25px 60px -15px rgba(6, 182, 212, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            background: 'radial-gradient(circle at top left, rgba(255,255,255,0.98) 0%, rgba(247,250,252,0.98) 100%)'
          }}
        >
          {/* Interactive hover effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-bl-full -mr-16 -mt-16 rotate-45"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-tr-full -ml-16 -mb-16 -rotate-45"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight tracking-tight">
                Welcome Back, <br className="sm:hidden" /><span className="text-gradient">User</span>
              </h1>
              <p className="text-cyan-600/80 font-medium flex items-center text-lg tracking-wide">
                <Rocket className="w-5 h-5 mr-2 animate-bounce" />
                Your personalized career dashboard
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-100/80 to-blue-100/80 text-cyan-800 shadow-xs border border-white/50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 text-cyan-600" />
                Premium Plan
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white/80 text-blue-800 border border-blue-100/50 shadow-xs backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                +12% growth
              </span>
            </div>
          </div>
        </div>

        {/* Search and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          

            {/* Stats Overview with Animated Cards */}
            <DashboardStats />
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700 tracking-wide">Quick Actions</h3>
                <div className="w-8 h-8 flex items-center justify-center bg-cyan-100/50 rounded-lg">
                  <Zap className="w-4 h-4 text-cyan-600" />
                </div>
              </div>
              <QuickActions />
            </div>

            {/* Recent Activity */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700 tracking-wide">Recent Activity</h3>
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100/50 rounded-lg">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* Job Dashboard Section */}
        <div className="relative group transform-gpu hover:-translate-y-1 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-blue-100/30 to-indigo-100/30 rounded-3xl -z-10 transition-all duration-500 group-hover:opacity-80 blur-xl"></div>
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden transition-all duration-500 hover:shadow-2xl"
            style={{
              boxShadow: '0 20px 50px -15px rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >

              
              <JobDashboard />

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
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-5px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
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
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;