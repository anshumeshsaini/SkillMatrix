import React from 'react';
import { Linkedin, Github, Twitter, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              SkillMatrix
            </h3>
            <p className="text-gray-400">
              Connecting top talent with world-class opportunities.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/jobs" className="text-gray-400 hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="/companies" className="text-gray-400 hover:text-white transition-colors">Companies</a></li>
              <li><a href="/career-resources" className="text-gray-400 hover:text-white transition-colors">Career Resources</a></li>
              <li><a href="/success-stories" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/resume-tips" className="text-gray-400 hover:text-white transition-colors">Resume Tips</a></li>
              <li><a href="/interview-prep" className="text-gray-400 hover:text-white transition-colors">Interview Prep</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span>hello@talentconnect.com</span>
              </li>
              <li className="text-gray-400">123 Career Lane</li>
              <li className="text-gray-400">San Francisco, CA 94107</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TalentConnect. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</a>
            <a href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-8 text-gray-600 text-sm flex items-center justify-center space-x-1">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <span>for job seekers worldwide</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;