import React from 'react';
import { Home, User, Mail, Phone, MessageSquare, AlertCircle, FileText, CreditCard, Settings, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';

import Navigation from './Navigation';
import Footer from './Footer';

const HelpSupportPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I change my plan?",
      answer: "You can upgrade or downgrade your plan at any time by contacting us on WhatsApp. We'll guide you through the process.",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />
    },
    {
      question: "When are deals shared with companies?",
      answer: "Deals are shared immediately after your purchase is confirmed. For Basic plan - 50 companies, Pro - 150 companies, Enterprise - 500 companies.",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />
    },
    {
      question: "How can I track my shared deals?",
      answer: "We'll provide you with a weekly report via email showing which companies received your deals and any responses we've received.",
      icon: <FileText className="h-5 w-5 text-blue-600" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept payments via WhatsApp payment links, UPI, and bank transfers. All transactions are secure.",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Simply message us on WhatsApp and we'll process your cancellation immediately. No cancellation fees.",
      icon: <Settings className="h-5 w-5 text-blue-600" />
    },
    {
      question: "What's your response time for support?",
      answer: "We typically respond within 1 business day. For urgent matters, please call us directly.",
      icon: <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  ];

  const contactMethods = [
    {
      name: "WhatsApp Chat",
      description: "Fastest way to get help",
      value: "+91 7379340224",
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      link: "https://wa.me/917379340224",
      bgColor: "bg-green-100"
    },
    {
      name: "Email Support",
      description: "For detailed inquiries",
      value: "support@dealshare.com",
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      link: "mailto:anshumesh.saini@gmail.com",
      bgColor: "bg-blue-100"
    },
    {
      name: "Phone Support",
      description: "Available 10AM-6PM IST",
      value: "+91 7379340224",
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      link: "tel:+917379340224",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Elegant Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <HelpCircle className="h-10 w-10 text-blue-600 mr-3" />
              <span className="text-blue-600 font-semibold tracking-wider">HOW CAN WE HELP?</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
              We're Here to <span className="text-blue-600">Help</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-700">
              Find answers or contact our support team directly
            </p>
          </div>

          {/* Floating Contact Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-20">
            {contactMethods.map((method, index) => (
              <div 
                key={index} 
                className={`${method.bgColor} overflow-hidden shadow-lg rounded-2xl transform transition-all hover:scale-105 hover:shadow-xl`}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 bg-white rounded-xl p-3 shadow-md">
                      {method.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-700">{method.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a
                      href={method.link}
                      className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      {method.name.split(' ')[0]} Support
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern FAQ Section */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-16">
            <div className="px-8 py-10 bg-gradient-to-r from-blue-600 to-cyan-600">
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="mt-2 text-blue-100">
                Quick answers to common questions about DealShare
              </p>
            </div>
            <div className="divide-y divide-gray-200/50">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="group px-8 py-6 transition-all hover:bg-blue-50/50"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-4">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transform group-hover:rotate-180 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating CTA Section */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5"></div>
            <div className="relative px-8 py-12 text-center">
              <div className="mx-auto max-w-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Still have questions?
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                  Our dedicated support team is available 24/7 to assist you with any inquiries.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="https://wa.me/917379340224"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    WhatsApp Chat
                  </a>
                  <a
                    href="mailto:anshumesh.saini@gmail.com"
                    className="inline-flex items-center justify-center px-8 py-4 border border-blue-600 text-base font-medium rounded-xl shadow-sm text-blue-600 bg-white hover:bg-blue-50 transition-all"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpSupportPage;