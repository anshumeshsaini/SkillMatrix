import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, ChevronDown, HelpCircle, CreditCard, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative"
      >
        <Button 
          onClick={() => navigate('/auth')}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 py-2 font-medium tracking-wide shadow-lg shadow-blue-500/20"
        >
          <span className="relative z-10 flex items-center">
            <span className="mr-2">Sign In</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </span>
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
    );
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button 
            variant="ghost" 
            className="relative h-10 w-auto px-2 rounded-full hover:bg-blue-100/30 transition-all duration-200 group backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 5 }}
                whileTap={{ rotate: -5 }}
              >
                <Avatar className="h-8 w-8 border-2 border-white/80 shadow-md">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-medium">
                      {getInitials(user.email || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </motion.div>
              <ChevronDown className="h-4 w-4 text-blue-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-72 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-1.5"
        align="end" 
        forceMount
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Profile Header */}
            <DropdownMenuLabel className="font-normal p-0">
              <motion.div 
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/80 mb-1 cursor-pointer hover:bg-white transition-all duration-200"
                onClick={() => navigate('/profile')}
                whileHover={{ x: 2 }}
              >
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-medium text-lg">
                      {getInitials(user.email || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-blue-600/80 truncate">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Premium Member
                    </span>
                  </div>
                </div>
              </motion.div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent my-1" />

            {/* Menu Items */}
            <div className="space-y-0.5">
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="flex items-center p-3 rounded-xl text-gray-800 hover:bg-white/90 focus:bg-white/90 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-100/80 mr-3 group-hover:bg-blue-200/50 transition-colors">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span className="block font-medium">Profile</span>
                  <span className="block text-xs text-blue-600/70">View your profile</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="flex items-center p-3 rounded-xl text-gray-800 hover:bg-white/90 focus:bg-white/90 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-cyan-100/80 mr-3 group-hover:bg-cyan-200/50 transition-colors">
                  <Settings className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <span className="block font-medium">Settings</span>
                  <span className="block text-xs text-blue-600/70">Customize your experience</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/notifications')}
                className="flex items-center p-3 rounded-xl text-gray-800 hover:bg-white/90 focus:bg-white/90 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-purple-100/80 mr-3 group-hover:bg-purple-200/50 transition-colors">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <span className="block font-medium">Notifications</span>
                  <span className="block text-xs text-blue-600/70">Manage alerts</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/billing')}
                className="flex items-center p-3 rounded-xl text-gray-800 hover:bg-white/90 focus:bg-white/90 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-100/80 mr-3 group-hover:bg-emerald-200/50 transition-colors">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="block font-medium">Billing</span>
                  <span className="block text-xs text-blue-600/70">Payment methods</span>
                </div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent my-1" />

            <DropdownMenuItem 
              onClick={() => navigate('/help')}
              className="flex items-center p-3 rounded-xl text-gray-800 hover:bg-white/90 focus:bg-white/90 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-100/80 mr-3 group-hover:bg-indigo-200/50 transition-colors">
                <HelpCircle className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <span className="block font-medium">Help Center</span>
                <span className="block text-xs text-blue-600/70">Get support</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent my-1" />

            <motion.div
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <DropdownMenuItem 
                onClick={signOut}
                className="flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50/90 focus:bg-red-50/90 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-100/80 mr-3 group-hover:bg-red-200/50 transition-colors">
                  <LogOut className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-medium">Sign Out</span>
                  <span className="block text-xs text-red-500/70">Log out of your account</span>
                </div>
              </DropdownMenuItem>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;