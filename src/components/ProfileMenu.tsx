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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => navigate('/auth')}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30 rounded-full px-6"
        >
          <span className="relative z-10">Sign In</span>
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
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
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto px-2 rounded-full hover:bg-gray-100/50 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
              {user.user_metadata?.avatar_url ? (
                <AvatarImage 
                  src={user.user_metadata.avatar_url} 
                  alt={user.user_metadata?.full_name || user.email}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-medium">
                  {getInitials(user.email || '')}
                </AvatarFallback>
              )}
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 border border-gray-200/80 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-2"
        align="end" 
        forceMount
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuLabel className="font-normal p-0">
              <div 
                className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 mb-1"
                onClick={() => navigate('/profile')}
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-medium">
                      {getInitials(user.email || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-gray-100/80 my-1" />

            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100/50 focus:bg-gray-100/50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 mr-3">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100/50 focus:bg-gray-100/50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 mr-3">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <span>Settings</span>
            </DropdownMenuItem>

           

            <DropdownMenuItem 
              onClick={() => navigate('/billing')}
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100/50 focus:bg-gray-100/50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 mr-3">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Billing</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-100/80 my-1" />

            <DropdownMenuItem 
              onClick={() => navigate('/help')}
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100/50 focus:bg-gray-100/50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-50 mr-3">
                <HelpCircle className="h-4 w-4 text-purple-600" />
              </div>
              <span>Help & Support</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-100/80 my-1" />

            <DropdownMenuItem 
              onClick={signOut}
              className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors duration-150 group"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 mr-3 group-hover:bg-red-100 group-focus:bg-red-100">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-red-600">Log out</span>
            </DropdownMenuItem>
          </motion.div>
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;