import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Zap, Award, TrendingUp, BookOpen, BarChart2 } from 'lucide-react';
import Lottie from 'lottie-react';
import waveAnimation from './animations/Wave.json';
import particleAnimation from './animations/Particlees.json';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'left'|'right'>('right');
  const [isHovered, setIsHovered] = useState(false);
  const particleRef = useRef(null);

  useEffect(() => {
    if (particleRef.current) {
      particleRef.current.setSpeed(0.3);
    }
  }, []);

  const nextSlide = () => {
    setTransitionDirection('right');
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setTransitionDirection('left');
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setTransitionDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Particle Animation Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Lottie
          lottieRef={particleRef}
          animationData={particleAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Mobile view - single image */}
      <div className="md:hidden flex justify-center">
        <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-3xl">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                index === currentIndex ? 'opacity-100 scale-100' : 
                transitionDirection === 'right' ? 'opacity-0 scale-90 -translate-x-full' : 'opacity-0 scale-90 translate-x-full'
              }`}
            >
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tablet and Desktop view - 2 images */}
      <div className="hidden md:flex items-center justify-center gap-6">
        <div className="relative w-[480px] h-[360px] overflow-hidden rounded-3xl">
          {images.map((image, index) => (
            <div 
              key={`main-${index}`}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                index === currentIndex ? 'opacity-100 scale-100' : 
                transitionDirection === 'right' ? 'opacity-0 scale-90 -translate-x-full' : 'opacity-0 scale-90 translate-x-full'
              }`}
            >
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
        </div>
        <div className="relative w-[480px] h-[360px] overflow-hidden rounded-3xl">
          {images.map((image, index) => (
            <div 
              key={`secondary-${index}`}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                index === (currentIndex + 1) % images.length ? 'opacity-100 scale-100' : 
                transitionDirection === 'right' ? 'opacity-0 scale-90 -translate-x-full' : 'opacity-0 scale-90 translate-x-full'
              }`}
            >
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-2xl hover:bg-white transition-all duration-300 hover:shadow-3xl hover:scale-110"
      >
        <ChevronLeft size={24} className="text-blue-600" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-2xl hover:bg-white transition-all duration-300 hover:shadow-3xl hover:scale-110"
      >
        <ChevronRight size={24} className="text-blue-600" />
      </button>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === i ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const sliderImages = [
    'https://internshala.com/static/images/tgs/homepage_trending/stt_v1.png',
    'https://internshala-uploads.internshala.com/banner-images/home_new/stt_year_july25-student.png.webp',
    'https://internshala-uploads.internshala.com/banner-images/home_new/bbhd_2025-student.png.webp',
    'https://internshala-uploads.internshala.com/banner-images/home_new/booking_holdings_tech_2025-student.png.webp',
    'https://internshala-uploads.internshala.com/banner-images/home_new/mahindra_logistics_2025-student.png.webp',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-indigo-50/20 p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/10 blur-3xl animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-indigo-200/10 blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 rounded-full bg-purple-200/10 blur-3xl animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with animated wave background */}


        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Trending Section */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-3">
                  <Zap className="text-yellow-500" size={24} />
                  <span>Trending on SkillMatrix</span>
                </h3>
                <p className="text-blue-600/80">Discover the most popular opportunities right now</p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-100/50 text-blue-800 border border-white/50 backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Updated daily
                </span>
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <ImageSlider images={sliderImages} />
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-xl border border-white/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="text-blue-600" size={20} />
                  <h4 className="font-semibold text-blue-800 text-lg">Certification courses</h4>
                </div>
                <p className="text-sm text-blue-600/90 mb-4">
                  Master the in-demand skills with our industry-recognized certification programs.
                </p>
                <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium">
                  <span>Explore Courses</span>
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50/50 p-6 rounded-xl border border-white/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="text-purple-600" size={20} />
                  <h4 className="font-semibold text-purple-800 text-lg">Learning Paths</h4>
                </div>
                <p className="text-sm text-purple-600/90 mb-4">
                  Structured learning journeys to take your career to the next level.
                </p>
                <button className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 text-sm font-medium">
                  <span>View Paths</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default DashboardStats;