import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Mobile view - single image */}
      <div className="md:hidden flex transition-transform duration-500 ease-in-out">
        <div className="flex-shrink-0 w-full">
          <img 
            src={images[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-auto object-cover rounded-xl shadow-md aspect-video"
          />
        </div>
      </div>
      
      {/* Tablet view - 2 images */}
      <div className="hidden md:flex lg:hidden items-center justify-center gap-4 transition-transform duration-500 ease-in-out">
        {[currentIndex, (currentIndex + 1) % images.length].map((index) => (
          <div 
            key={`${currentIndex}-${index}`} 
            className="flex-shrink-0 w-[48%]"
          >
            <img 
              src={images[index]} 
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover rounded-xl shadow-md aspect-video"
            />
          </div>
        ))}
      </div>
      
      {/* Desktop view - 3 images (original behavior) */}
      <div className="hidden lg:flex items-center justify-between gap-6 transition-transform duration-500 ease-in-out">
        {[currentIndex, (currentIndex + 1) % images.length, (currentIndex + 2) % images.length].map((index) => (
          <div 
            key={`${currentIndex}-${index}`} 
            className="flex-shrink-0 w-[420px] h-[280px]"
          >
            <img 
              src={images[index]} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/90 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
        disabled={isTransitioning}
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6 text-blue-600" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/90 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
        disabled={isTransitioning}
      >
        <ChevronRight size={20} className="md:w-6 md:h-6 text-blue-600" />
      </button>
      
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(i);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              currentIndex === i ? 'bg-blue-600 w-4 md:w-6' : 'bg-gray-300 hover:bg-gray-400'
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
    <div className="grid grid-cols-1 gap-6 px-4 sm:px-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-6">Trending on SkillMatrix</h3>
        <div className="w-full lg:w-[1320px] mx-auto overflow-hidden">
          <ImageSlider images={sliderImages} />
        </div>
        
        <div className="mt-4 sm:mt-6">
          <h4 className="font-semibold text-blue-700 text-base sm:text-lg">Certification courses</h4>
          <p className="text-sm text-blue-600 mb-2 sm:mb-3">Master the in-demand skills!</p>
          <p className="text-xs sm:text-sm text-blue-500 mb-3 sm:mb-4">
            Get govt.-accredited certification and level-up your resume.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;