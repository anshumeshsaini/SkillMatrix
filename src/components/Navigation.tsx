import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, MessageSquare, Menu, Sparkles, Briefcase, BarChart2, Bell, ChevronDown, Plus } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import logo from './assets/Screenshot_2025-07-19_at_2.36.50_PM-removebg-preview.png';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [subMenuOpen, setSubMenuOpen] = React.useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Dashboard', 
      accent: 'from-purple-500 to-pink-500',
      subItems: [
        { path: '/analytics', label: 'Analytics' },
        { path: '/projects', label: 'Projects' }
      ]
    },
    { 
      path: '/messages', 
      icon: MessageSquare, 
      label: 'Messages', 
      accent: 'from-blue-500 to-cyan-500',
      badge: 3
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile', 
      accent: 'from-violet-500 to-indigo-500',
      subItems: [
        { path: '/profile/skills', label: 'Skills' },
        { path: '/profile/achievements', label: 'Achievements' }
      ]
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings', 
      accent: 'from-sky-500 to-blue-500',
      subItems: [
        { path: '/settings/account', label: 'Account' },
        { path: '/settings/notifications', label: 'Notifications' },
        { path: '/settings/privacy', label: 'Privacy' }
      ]
    },
  ];

  return (
    <nav className="bg-gradient-to-b from-white/90 via-white/80 to-white/60 backdrop-blur-xl border-b border-gray-200/40 sticky top-0 z-50 shadow-sm shadow-gray-100/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group relative">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-14 w-auto transition-all duration-500 group-hover:scale-105 relative z-10"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-2xl tracking-tight leading-none">
                    SkillMatrix
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block w-fit">
                    Premium Edition
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div 
                key={link.path}
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  setHoveredItem(link.path);
                  if (link.subItems) setSubMenuOpen(link.path);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setSubMenuOpen(null);
                }}
              >
                <div className="relative h-full flex flex-col justify-center">
                  <Link to={link.path}>
                    <Button 
                      variant="ghost" 
                      size="custom"
                      className={`h-full px-6 rounded-none font-medium text-gray-600 hover:text-gray-900 hover:bg-transparent flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                        isActive(link.path) ? 'text-gray-900' : ''
                      }`}
                    >
                      <div className="relative">
                        <link.icon className={`h-5 w-5 transition-all duration-300 ${isActive(link.path) ? 'scale-110' : ''}`} />
                        {isActive(link.path) && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                        )}
                        {link.badge && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium">{link.label}</span>
                      {link.subItems && (
                        <ChevronDown className={`h-3 w-3 mt-0.5 transition-transform duration-200 ${subMenuOpen === link.path ? 'rotate-180' : ''}`} />
                      )}
                    </Button>
                  </Link>
                  
                  {/* Animated hover effect */}
                  {hoveredItem === link.path && !isActive(link.path) && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r ${link.accent} rounded-full animate-underline`} />
                  )}
                </div>

                {/* Submenu Dropdown */}
                {subMenuOpen === link.path && link.subItems && (
                  <div className="absolute top-full left-0 w-56 pt-2">
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl shadow-gray-400/10 border border-gray-200/50 overflow-hidden">
                      <div className="py-1">
                        {link.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-colors duration-200 flex items-center"
                          >
                            <span className={`h-1.5 w-1.5 rounded-full mr-3 ${isActive(subItem.path) ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}></span>
                            {subItem.label}
                            {isActive(subItem.path) && (
                              <Sparkles className="h-3 w-3 ml-auto text-purple-500" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Create New Button */}
          
            
            {/* Profile with Status Indicator */}
            <div className="relative ml-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 hover:opacity-30 blur-md transition-opacity duration-300"></div>
              <ProfileMenu />
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm shadow-emerald-400/50 animate-pulse"></div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center space-x-3">
           
            
          
            {/* Profile */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 hover:opacity-30 blur-md transition-opacity duration-300"></div>
              <ProfileMenu mobile />
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm shadow-emerald-400/50"></div>
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
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-xl z-40 lg:hidden">
            <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-white/95 via-white/90 to-white/95 shadow-2xl shadow-gray-900/20">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200/30 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-60 blur-md"></div>
                      <img 
                        src={logo} 
                        alt="Logo" 
                        className="h-10 w-auto relative"
                      />
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xl">
                      SkillMatrix
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                
                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.path} className="mb-1">
                      <Link 
                        to={link.path} 
                        onClick={() => !link.subItems && setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button 
                          variant={isActive(link.path) ? 'default' : 'ghost'} 
                          size="lg"
                          className={`w-full justify-between rounded-xl ${
                            isActive(link.path) 
                              ? `bg-gradient-to-r ${link.accent} text-white shadow-md` 
                              : 'text-gray-700 hover:bg-gray-50/80'
                          }`}
                        >
                          <div className="flex items-center">
                            <link.icon className="h-5 w-5 mr-3" />
                            {link.label}
                            {link.badge && (
                              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          {link.subItems && (
                            <ChevronDown className={`h-4 w-4 transition-transform ${subMenuOpen === link.path ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </Link>
                      
                      {/* Mobile Submenu */}
                      {link.subItems && subMenuOpen === link.path && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100/50 space-y-1">
                          {link.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block"
                            >
                              <Button 
                                variant={isActive(subItem.path) ? 'default' : 'ghost'} 
                                size="sm"
                                className={`w-full justify-start rounded-lg ${
                                  isActive(subItem.path) 
                                    ? `bg-gradient-to-r ${link.accent} text-white shadow` 
                                    : 'text-gray-600 hover:bg-gray-50/60'
                                }`}
                              >
                                {subItem.label}
                                {isActive(subItem.path) && (
                                  <Sparkles className="h-3 w-3 ml-auto" />
                                )}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-gray-200/30">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="w-full justify-center text-gray-500 hover:text-gray-900"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes underline {
          0% { width: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { width: 100%; }
        }
        .animate-underline {
          animation: underline 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;