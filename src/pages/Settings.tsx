import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navigation from '@/components/Navigation';
import { Settings, Bell, Lock, User, Mail, Eye, EyeOff, Download, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Header */}
        <div className="mb-16 text-center">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
              <Settings className="w-8 h-8" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
            Account <span className="text-blue-600">Settings</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Customize your experience with our elegant settings panel
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-400/10 text-blue-600 font-medium transition-all hover:shadow-md">
                      <Bell className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-gray-700 font-medium transition-all hover:bg-gray-100/50 hover:shadow-sm">
                      <Lock className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      <span>Privacy</span>
                    </button>
                    <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-gray-700 font-medium transition-all hover:bg-gray-100/50 hover:shadow-sm">
                      <User className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      <span>Account</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
              
              {/* Profile Card */}
             
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Notifications Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-400/5 border-b border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                    <Bell className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">Notifications</CardTitle>
                    <CardDescription className="text-gray-600">Choose what notifications you want to receive</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200/50">
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600">
                      <Mail className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-black">New job matches</p>
                      <p className="text-sm text-gray-600">
                        Get notified when new jobs match your skills
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300" />
                </div>
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 rounded-xl bg-cyan-100/50 text-cyan-600">
                      <User className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Application updates</p>
                      <p className="text-sm text-gray-600">
                        Get notified about application status changes
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-300" />
                </div>
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600">
                      <Mail className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Messages</p>
                      <p className="text-sm text-gray-600">
                        Get notified about new messages
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300" />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-400/5 border-b border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                    <Lock className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">Privacy</CardTitle>
                    <CardDescription className="text-gray-600">Control your privacy and visibility settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200/50">
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 rounded-xl bg-emerald-100/50 text-emerald-600">
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Profile visibility</p>
                      <p className="text-sm text-gray-600">
                        Make your profile visible to recruiters
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300" />
                </div>
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 rounded-xl bg-amber-100/50 text-amber-600">
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Show online status</p>
                      <p className="text-sm text-gray-600">
                        Let others see when you're online
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-gray-300" />
                </div>
              </CardContent>
            </Card>

            {/* Account Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-400/5 border-b border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                    <User className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">Account</CardTitle>
                    <CardDescription className="text-gray-600">Manage your account settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 py-6">
                <Button variant="outline" className="w-full justify-start space-x-4 py-5 rounded-xl border-gray-300 hover:bg-gray-100/50 hover:shadow-sm">
                  <Lock className="w-5 h-5 text-blue-600" strokeWidth={2} />
                  <span className="text-gray-700">Change Password</span>
                </Button>
                <Button variant="outline" className="w-full justify-start space-x-4 py-5 rounded-xl border-gray-300 hover:bg-gray-100/50 hover:shadow-sm">
                  <Download className="w-5 h-5 text-cyan-600" strokeWidth={2} />
                  <span className="text-gray-700">Download Data</span>
                </Button>
                <Button variant="destructive" className="w-full justify-start space-x-4 py-5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg">
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                  <span>Delete Account</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <Button className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500">
          <Settings className="w-6 h-6" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;