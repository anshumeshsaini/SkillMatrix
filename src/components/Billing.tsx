import React, { useState } from 'react';
import { Zap, Check, Shield, BadgeCheck, ArrowRight, Home, User, Settings, Mail, Phone, Star, ChevronDown } from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';

const Billing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const plans = {
    monthly: [
      {
        id: 'basic',
        name: 'Basic',
        price: '$9',
        period: 'month',
        deals: '50 company deals',
        features: ['Basic analytics', 'Email support', '1GB storage'],
        recommended: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$29',
        period: 'month',
        deals: '150 company deals',
        features: ['Advanced analytics', 'Priority support', '10GB storage', 'API access'],
        recommended: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$99',
        period: 'month',
        deals: '500 company deals',
        features: ['Advanced analytics', '24/7 support', '100GB storage', 'API access', 'Dedicated account manager'],
        recommended: false
      }
    ],
    annual: [
      {
        id: 'basic',
        name: 'Basic',
        price: '$90',
        period: 'year',
        deals: '50 company deals',
        features: ['Basic analytics', 'Email support', '1GB storage'],
        savings: 'Save 17%',
        recommended: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$290',
        period: 'year',
        deals: '150 company deals',
        features: ['Advanced analytics', 'Priority support', '10GB storage', 'API access'],
        savings: 'Save 17%',
        recommended: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$990',
        period: 'year',
        deals: '500 company deals',
        features: ['Advanced analytics', '24/7 support', '100GB storage', 'API access', 'Dedicated account manager'],
        savings: 'Save 17%',
        recommended: false
      }
    ]
  };

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId);
    const plan = [...plans.monthly, ...plans.annual].find(p => p.id === planId);
    const message = `Hi, I'm interested in purchasing the ${plan?.name} plan (${activePlan}) for ${plan?.price}/${plan?.period} that includes ${plan?.deals}.`;
    window.open(`https://wa.me/917379340224?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Elegant Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">

              <span className="text-blue-600 font-medium">PRICING PLANS</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
              Simple, <span className="text-blue-600">Transparent</span> Pricing
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-700">
              Choose the perfect plan for your needs. Switch or cancel anytime.
            </p>
            
            {/* Premium Toggle */}
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-inner">
                <div className="flex items-center">
                  <button
                    onClick={() => setActivePlan('monthly')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      activePlan === 'monthly' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setActivePlan('annual')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      activePlan === 'annual' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Annual <span className="text-blue-500">(Save 17%)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6 relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/30 rounded-full filter blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-200/30 rounded-full filter blur-3xl opacity-50"></div>
            
            {plans[activePlan].map((plan, index) => (
              <div 
                key={`${activePlan}-${index}`} 
                className={`relative rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  plan.recommended 
                    ? 'border-0 bg-white shadow-2xl ring-2 ring-blue-500/20' 
                    : 'border border-gray-200/80 bg-white/90 backdrop-blur-sm'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center justify-center px-6 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <Star className="w-4 h-4 mr-1.5 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>
                    {plan.recommended && (
                      <span className="text-blue-500 text-xl">★</span>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <p className="flex items-baseline text-gray-900">
                      <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="ml-2 text-xl font-semibold text-gray-500">/{plan.period}</span>
                    </p>
                    {plan.savings && (
                      <p className="mt-1 text-sm font-medium text-blue-600">{plan.savings}</p>
                    )}
                  </div>
                  
                  <p className="mt-4 font-medium text-blue-600">{plan.deals}</p>
                  <p className="mt-1 text-gray-500">Perfect for {plan.name.toLowerCase()} users</p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-100/50 p-1 rounded-full">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`mt-8 w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-medium transition-all ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700' 
                        : 'bg-gray-900 text-white shadow-md hover:bg-gray-800'
                    }`}
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Elegant FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-3 text-lg text-gray-600">Find answers to common questions about our plans</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
              {[
                {
                  question: "How many deals will be shared?",
                  answer: "Basic plan shares with 50 companies, Pro with 150 companies, and Enterprise with 500 companies."
                },
                {
                  question: "Can I change plans later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time."
                },
                {
                  question: "How do I cancel my subscription?",
                  answer: "Simply message us on WhatsApp and we'll process your cancellation."
                },
                {
                  question: "When will my deals be shared?",
                  answer: "Deals are shared immediately after purchase confirmation."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept payments via WhatsApp payment links, UPI, and bank transfers."
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className={`border-b border-gray-200/50 last:border-0 transition-all ${expandedFaq === index ? 'bg-blue-50/30' : ''}`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                  <div 
                    className={`px-6 pb-6 pt-0 text-gray-700 transition-all overflow-hidden ${
                      expandedFaq === index ? 'block' : 'hidden'
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Our support team is available 24/7 to help you choose the right plan.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="https://wa.me/917379340224"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-blue-600 bg-white hover:bg-blue-50"
                  >

                    Chat with Support
                  </a>
                  <a
                    href="mailto:anshumesh.saini@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-xl shadow-sm text-white hover:bg-blue-700/20"
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

export default Billing;