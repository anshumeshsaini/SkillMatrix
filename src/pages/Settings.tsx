import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/Navigation';
import { Settings, Bell, Lock, User, Mail, Eye, EyeOff, Download, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-800">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Account Settings
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Customize your experience and manage your personal preferences
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="sticky top-24 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-medium">
                    <Lock className="w-5 h-5" />
                    <span>Privacy</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-medium">
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications Card */}
            <Card className="border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">Notifications</CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">New job matches</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified when new jobs match your skills
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300" />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Application updates</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified about application status changes
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-300" />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified about new messages
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-slate-300" />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Card */}
            <Card className="border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">Privacy</CardTitle>
                    <CardDescription>Control your privacy and visibility settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Profile visibility</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Make your profile visible to recruiters
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300" />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Show online status</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Let others see when you're online
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-slate-300" />
                </div>
              </CardContent>
            </Card>

            {/* Account Card */}
            <Card className="border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">Account</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 py-6">
                <Button variant="outline" className="w-full justify-start space-x-3 py-6">
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </Button>
                <Button variant="outline" className="w-full justify-start space-x-3 py-6">
                  <Download className="w-5 h-5" />
                  <span>Download Data</span>
                </Button>
                <Button variant="destructive" className="w-full justify-start space-x-3 py-6 hover:bg-red-700/90">
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;