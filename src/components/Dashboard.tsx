import React, { useState, useRef } from 'react';
import { Sparkles, TrendingUp, Rocket, Search, BarChart2, Globe, Shield, Clock, Users, Target, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import heroAnimation from './animations/Business.json';
import featureAnimation from './animations/Step.json';
import JobDashboard from './JobDashboard';
import PlacementGuaranteeCourses from './PlacementGuaranteeCourses';
import JobPostingModal from './JobPostingModal';
import Footer from './Footer';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);
  const heroRef = useRef(null);

  const handleJobPosted = () => {
    setJobPostingModalOpen(false);
    // Add any additional job posted logic here
  };

  const features = [
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Real-time data and insights to track your career progress"
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      title: "Global Opportunities",
      description: "Access to jobs from top companies worldwide"
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-600" />,
      title: "Privacy Focused",
      description: "Your data is always secure and private"
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me land my dream job in just 3 weeks!",
      author: "Sarah Johnson",
      role: "Product Designer at TechCorp"
    },
    {
      quote: "The certification courses boosted my skills and confidence.",
      author: "Michael Chen",
      role: "Senior Developer at Innovate Inc."
    },
    {
      quote: "Best career decision I've made. 5/5 stars!",
      author: "David Wilson",
      role: "Marketing Manager at BrandCo"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Launch Your <span className="text-blue-600">Dream Career</span> Today
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                The all-in-one platform to develop skills, find opportunities, and accelerate your professional growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 whitespace-nowrap">
                  Get Started
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">


              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl -rotate-6"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 rotate-1">
                <Lottie
                  animationData={heroAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="bg-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <p className="text-center text-gray-500 mb-8">Trusted by leading companies worldwide</p>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
      {[
        { name: 'Google', logo: 'https://imgs.search.brave.com/i0DENobgN0P77lDm5I1RVTCEGAPy8Kp9e_GwORGJvAM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4u/bG9nb2pveS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjMw/ODAxMTQ1NjA4L0N1/cnJlbnQtR29vZ2xl/LWxvZ28tMjAxNS0y/MDIzLTYwMHgyMDMu/cG5n' },
        { name: 'Microsoft', logo: 'https://imgs.search.brave.com/rHKTlB4z7lnsWsR0rv7P9UQqH4b2TDVEDdZehYrrXYo/rs:fit:500:0:1:0/g:ce/aHR0cDovL3d3dy5i/cmFuZC1pZGVudGlr/aXQuaXQvc2l0ZXMv/ZGVmYXVsdC9maWxl/cy9taWNyb3NvZnQt/YXBlcnR1cmEtMDUu/anBn' },
        { name: 'Amazon', logo: 'https://imgs.search.brave.com/K4NQeEJv1rVc6Ima07YJquV_bh7ZFCReKh_EsAuRpNE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzk5LzA0Lzgy/LzM2MF9GXzM5OTA0/ODI5NV9iUUN6NVY3/TTJRWlZudXYwN2x3/SHVNaVFzUjRYNm83/WC5qcGc' },

        { name: 'Facebook', logo: 'https://imgs.search.brave.com/pnZd5HGknK6hgVIPdLkF1Vsf35Vxlh2yd8_f65-tJSw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2FjLzQy/L2MyL2FjNDJjMmE5/YTU4YzQzOGVkZGQ3/MTdiYzljMmY2ODI4/LmpwZw' },
        { name: 'Netflix', logo: 'https://imgs.search.brave.com/4_G5GtEYed2p7u2zXYg-JjrbttCPF0ej9cuTLzb0mzM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA1/L05ldGZsaXgtTG9n/by01MDB4MjgxLnBu/Zw' },
        { name: 'Netflix', logo: 'https://imgs.search.brave.com/xDVLVggHw_0FyRgpBI4JDdeZJPNxpuv0XXWZAz_ofbI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWRo/d2FuaWZvdW5kYXRp/b24ub3JnL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzExL0dM/QS1VTklWRVJTSVRZ/LU1BVEhVUkEtMTAy/NHg0MjMucG5n' }
      ].map((company, index) => (
        <div 
          key={index} 
          className="flex items-center justify-center p-3 hover:grayscale-0 transition-all"
        >
          <img 
            src={company.logo} 
            alt={company.name} 
            className="h-16 object-contain" 
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-blue-600">Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines powerful tools with expert guidance to help you reach your career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                Our Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple Steps to <span className="text-blue-600">Career Success</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Your Profile", description: "Build your professional profile in minutes" },
                  { step: "2", title: "Develop Skills", description: "Take our certification courses to boost your skills" },
                  { step: "3", title: "Find Opportunities", description: "Get matched with perfect job opportunities" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Learn More
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl -rotate-6"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 rotate-1">
                  <Lottie
                    animationData={featureAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
     

      {/* CTA Section */}
    

      {/* Dashboard Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div 
          id="certification-courses" 
          className="transition-all duration-500 transform-gpu hover:-translate-y-1 mt-12"
        >
          <PlacementGuaranteeCourses />
        </div>
      </div>

      {/* Certification Widget */}


      {jobPostingModalOpen && (
        <JobPostingModal
          onClose={() => setJobPostingModalOpen(false)}
          onJobPosted={handleJobPosted}
        />
      )}
 <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-blue-600">Users Say</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="mb-6">
                  <div className="flex space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-800 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;