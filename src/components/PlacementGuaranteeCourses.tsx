import React from 'react';
import styled from 'styled-components';
import { Zap, Award, Briefcase, Clock, DollarSign, Users, ArrowRight, Sparkles } from 'lucide-react';

const CourseCardWrapper = styled.div`
  .card_box {
    width: 320px;
    height: 480px;
    border-radius: 24px;
    background: white;
    position: relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(255,255,255,0.3);
    overflow: hidden;
    backdrop-filter: blur(10px);
    z-index: 1;
  }

  .card_box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 24px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card_box:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
    border-color: rgba(255,255,255,0.6);
  }

  .card_box:hover::before {
    opacity: 1;
  }

  .premium_span {
    position: absolute;
    width: 180px;
    height: 180px;
    top: -15px;
    left: -15px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    overflow: hidden;
  }

  .premium_span::before {
    content: 'ELITE';
    position: absolute;
    width: 200%;
    height: 48px;
    background: linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%);
    transform: rotate(-45deg) translateY(-25px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  .premium_span::after {
    content: '';
    position: absolute;
    width: 12px;
    bottom: 0;
    left: 0;
    height: 12px;
    z-index: -1;
    box-shadow: 160px -160px #cc3f47;
    background: linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%);
  }

  .glow-effect {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .card_box:hover .glow-effect {
    opacity: 1;
  }
`;

const PlacementGuaranteeCourses: React.FC = () => {
  const courseImages = [
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/full-stack-web-development-specialization-v2.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/data-science-specialization-v3.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/human-resource-management-specialization-v2.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/digital-marketing-specialization-v2.png?v=v6'
  ];

  const courses = [
    {
      title: "Full Stack Development Masterclass",
      tag: "GUARANTEED JOB PLACEMENT",
      duration: "6 Month Intensive Program",
      salary: "₹3-10 LPA Starting Salary",
      opportunities: "100,000+ Career Opportunities",
      image: courseImages[0],
      isPremium: true,
      highlights: ["1:1 Mentorship", "Capstone Project", "Industry Certifications"]
    },
    {
      title: "Data Science Professional",
      tag: "INTERNSHIP PLACEMENT",
      duration: "6 Month Comprehensive Training",
      salary: "₹40,000 Minimum Stipend",
      opportunities: "45,500+ Hiring Partners",
      image: courseImages[1],
      isPremium: false,
      highlights: ["Real-world Projects", "Kaggle Competitions", "ML Deployment"]
    },
    {
      title: "HR Executive Program",
      tag: "JOB PLACEMENT ASSURED",
      duration: "3 Month Accelerated Course",
      salary: "₹3-10 LPA Compensation",
      opportunities: "290,000+ Open Positions",
      image: courseImages[2],
      isPremium: true,
      highlights: ["Talent Acquisition", "Compensation Strategy", "HR Analytics"]
    },
    {
      title: "Digital Marketing Pro",
      tag: "GUARANTEED JOB PLACEMENT",
      duration: "5 Month Immersive Program",
      salary: "₹3-10 LPA Starting Package",
      opportunities: "825,000+ Digital Roles",
      image: courseImages[3],
      isPremium: false,
      highlights: ["SEO/SEM Certified", "Social Media Mastery", "Campaign Management"]
    }
  ];

  return (
    <div className="max-w-8xl mx-auto px-8 py-16 font-sans overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-indigo-100/20 to-pink-100/20 blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
              <Zap className="text-yellow-400" size={20} />
              <span className="text-sm font-medium text-blue-800">PREMIUM PROGRAMS</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Career Accelerators</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Transform your career with our industry-leading, placement-guaranteed programs
            </p>
          </div>
          <button className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600/90 hover:to-purple-600/90 transition-all duration-300">
            <span>View All Programs</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <CourseCardWrapper key={index}>
              <div className="card_box">
                {/* Glow effect */}
                <div className="glow-effect"></div>
                
                {/* Premium ribbon */}
                {course.isPremium && (
                  <div className="premium_span" />
                )}
                
                {/* Image container */}
                <div className="w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                  {course.image && (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Content container */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${course.isPremium ? 'bg-yellow-100/80 text-yellow-800' : 'bg-blue-100/80 text-blue-800'}`}>
                      {course.tag}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 text-gray-800">{course.title}</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">{course.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{course.opportunities}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.highlights.map((highlight, i) => (
                        <span key={i} className="text-xs font-medium px-2 py-1 bg-gray-100/60 rounded-full text-gray-700">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${course.isPremium ? 
                      'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-400/30' : 
                      'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-400/30'}`}>
                      <span>Explore Program</span>
                      {course.isPremium && <Sparkles className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </CourseCardWrapper>
          ))}
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-5px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PlacementGuaranteeCourses;