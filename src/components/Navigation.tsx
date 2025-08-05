import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, MessageSquare, Menu, Sparkles, Briefcase, BarChart2, Bell } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import logo from './assets/Screenshot_2025-07-19_at_2.36.50_PM-removebg-preview.png';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', icon: Home, label: 'Dashboard', accent: 'from-purple-500 to-pink-500' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', accent: 'from-blue-500 to-cyan-500' },



    { path: '/profile', icon: User, label: 'Profile', accent: 'from-violet-500 to-indigo-500' },
    { path: '/settings', icon: Settings, label: 'Settings', accent: 'from-sky-500 to-blue-500' },
  ];

  return (
    <nav className="bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-lg border-b border-gray-200/75 sticky top-0 z-50 shadow-sm shadow-gray-100/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 mix-blend-multiply blur-[1px] transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-2xl tracking-tight">
                    SkillMatrix
                  </span>
                  <span className="text-xs text-gray-400 font-medium tracking-wider">PREMIUM EDITION</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div 
                key={link.path}
                className="relative"
                onMouseEnter={() => setHoveredItem(link.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link to={link.path}>
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className={`h-16 px-5 rounded-none font-medium text-gray-600 hover:text-gray-900 hover:bg-transparent flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                      isActive(link.path) ? 'text-gray-900' : ''
                    }`}
                  >
                    <div className="relative">
                      <link.icon className={`h-5 w-5 transition-all duration-200 ${isActive(link.path) ? 'scale-110' : ''}`} />
                      {isActive(link.path) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                      )}
                    </div>
                    <span className="text-xs font-normal">{link.label}</span>
                  </Button>
                </Link>
                
                {/* Animated hover effect */}
                {hoveredItem === link.path && !isActive(link.path) && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-[3px] bg-gradient-to-r ${link.accent} rounded-full`} />
                )}
              </div>
            ))}
            
            {/* Premium Upgrade Button */}
           
            
            {/* Profile with Status Indicator */}
            <div className="relative ml-4">
              <ProfileMenu />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center space-x-1">
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 rounded-full relative"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </Button>

            {/* Profile */}
            <div className="relative">
              <ProfileMenu mobile />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 lg:hidden">
            <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="h-10 w-auto"
                    />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xl">
                      SkillMatrix
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                
                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link 
                      to={link.path} 
                      key={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button 
                        variant={isActive(link.path) ? 'default' : 'ghost'} 
                        size="lg"
                        className={`w-full justify-start rounded-lg ${
                          isActive(link.path) 
                            ? `bg-gradient-to-r ${link.accent} text-white shadow-md` 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <link.icon className="h-5 w-5 mr-3" />
                        {link.label}
                        {isActive(link.path) && (
                          <Sparkles className="h-4 w-4 ml-auto" />
                        )}
                      </Button>
                    </Link>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;