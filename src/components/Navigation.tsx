import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, Settings, MessageSquare, Menu } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import logo from './assets/Screenshot_2025-07-19_at_2.36.50_PM-removebg-preview.png';


const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-10 sm:h-12 w-auto mr-2"
                />
                <span className="text-blue-800 font-semibold text-lg">
                  SkillMatrix
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <Link to={link.path} key={link.path}>
                <Button 
                  variant={isActive(link.path) ? 'default' : 'ghost'} 
                  size="sm"
                  className={`flex items-center gap-2 ${isActive(link.path) ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-50'}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            <ProfileMenu />
          </div>

          {/* Mobile Navigation - SkillMatrix, Messages, Profile, and Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* SkillMatrix text - only visible when logo is hidden */}
            
            {/* Messages Icon Button */}
            <Link to="/messages" className="inline-flex items-center justify-center">
              <Button
                variant={isActive('/messages') ? 'default' : 'ghost'} 
                size="sm"
                className={`p-2 ${isActive('/messages') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-50'}`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>

            {/* Profile Icon Button */}
            <Link to="/profile" className="inline-flex items-center justify-center">
              <Button
                variant={isActive('/profile') ? 'default' : 'ghost'} 
                size="sm"
                className={`p-2 ${isActive('/profile') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-50'}`}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-blue-800 hover:bg-blue-50 p-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                size="sm"
                className={`w-full justify-start ${isActive('/') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-50'}`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link 
              to="/settings" 
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button 
                variant={isActive('/settings') ? 'default' : 'ghost'} 
                size="sm"
                className={`w-full justify-start ${isActive('/settings') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-50'}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <div className="pt-2 border-t border-blue-100">
              <ProfileMenu mobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;