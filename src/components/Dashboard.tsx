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
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);
  const heroRef = useRef(null);

  const handleJobPosted = () => {
    setJobPostingModalOpen(false);
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
    <div className="min-h-screen bg-white antialiased">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50/50 to-cyan-50/50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-100/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-100/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">

                <span className="text-sm font-medium text-gray-700">The future of career growth</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Dream Career</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                The all-in-one platform to develop skills, find opportunities, and accelerate your professional growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 whitespace-nowrap rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <img 
                      key={item}
                      src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item+20}.jpg`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">10,000+ professionals</span> have launched their careers
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-3xl -rotate-6 shadow-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50 rotate-1 transition-all duration-500 hover:rotate-0">
                <Lottie
                  animationData={heroAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-10 text-lg">Trusted by leading companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 items-center justify-center">
            {[
              { name: 'Google', logo: 'https://imgs.search.brave.com/i0DENobgN0P77lDm5I1RVTCEGAPy8Kp9e_GwORGJvAM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4u/bG9nb2pveS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjMw/ODAxMTQ1NjA4L0N1/cnJlbnQtR29vZ2xl/LWxvZ28tMjAxNS0y/MDIzLTYwMHgyMDMu/cG5n' },
              { name: 'Microsoft', logo: 'https://imgs.search.brave.com/fkQBcqH_lKXFBPV_EpCMD4y0x9bbEWaXjk5ZyEEvUyo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9waXh5/Lm9yZy9zcmMvNDI5/L3RodW1iczM1MC80/Mjk0OTk5LmpwZw' },
              { name: 'Amazon', logo: 'https://imgs.search.brave.com/y4oNSxnN9VO57utZdjGfBQC9h-bqLO470C0QgabtNvo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zaW1w/bGUtdmVjdG9yLWZp/bGxlZC1mbGF0LWFt/YXpvbi1pY29uLWxv/Z28tc29saWQtYmxh/Y2stcGljdG9ncmFt/LWlzb2xhdGVkLXdo/aXRlLWJhY2tncm91/bmQtYW1hem9uLWxv/Z28tMTU5MDI5MDc0/LmpwZw' },
              { name: 'Facebook', logo: 'https://imgs.search.brave.com/V8n8LzeedWDO7kcVbOs5V47Eg1VwU9jM690FTUb0aQ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTgwNDg5/My82NjU4L3YvNDUw/L2RlcG9zaXRwaG90/b3NfNjY1ODM4OTUt/c3RvY2staWxsdXN0/cmF0aW9uLWZhY2Vi/b29rLWxvZ28uanBn' },
              { name: 'Netflix', logo: 'https://imgs.search.brave.com/4_G5GtEYed2p7u2zXYg-JjrbttCPF0ej9cuTLzb0mzM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA1/L05ldGZsaXgtTG9n/by01MDB4MjgxLnBu/Zw' },
              { name: 'Netflix', logo: 'https://imgs.search.brave.com/xDVLVggHw_0FyRgpBI4JDdeZJPNxpuv0XXWZAz_ofbI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWRo/d2FuaWZvdW5kYXRp/b24ub3JnL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzExL0dM/QS1VTklWRVJTSVRZ/LU1BVEhVUkEtMTAy/NHg0MjMucG5n' }
            ].map((company, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300"
              >
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-12 object-contain  hover:opacity-100 transition-opacity duration-300" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">

              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Career With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Cutting-Edge Tools</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines powerful tools with expert guidance to help you reach your career goals faster than ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mb-6 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                      Learn more
                      <ChevronRight className="ml-1 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                Our Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Simple Steps to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Career Success</span>
              </h2>
              
              <div className="space-y-8">
                {[
                  { step: "1", title: "Create Your Profile", description: "Build your professional profile in minutes with our intuitive builder" },
                  { step: "2", title: "Develop Skills", description: "Take our certification courses to boost your skills and marketability" },
                  { step: "3", title: "Find Opportunities", description: "Get matched with perfect job opportunities based on your profile" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-blue-800 font-bold text-xl shadow-inner group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-cyan-100 transition-all duration-300">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="mt-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                Start Your Journey
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-3xl -rotate-6 shadow-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50 rotate-1 p-6">
                <Lottie
                  animationData={featureAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center">


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      

      {/* Dashboard Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative group transform-gpu hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-blue-100/30 to-indigo-100/30 rounded-3xl -z-10 transition-all duration-500 group-hover:opacity-80 blur-xl"></div>
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 hover:shadow-3xl"
            style={{
              boxShadow: '0 25px 60px -15px rgba(6, 182, 212, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <JobDashboard />
          </div>
        </div>

        <div 
          id="certification-courses" 
          className="transition-all duration-500 transform-gpu hover:-translate-y-2 mt-16"
        >
          <PlacementGuaranteeCourses />
        </div>
      </div>
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <Award className="w-4 h-4 mr-2" />
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Users Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from professionals who transformed their careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-8">
                  <div className="flex space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl w-12 h-12 flex items-center justify-center text-blue-800 font-bold text-xl shadow-inner">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA */}
    
      {jobPostingModalOpen && (
        <JobPostingModal
          onClose={() => setJobPostingModalOpen(false)}
          onJobPosted={handleJobPosted}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;