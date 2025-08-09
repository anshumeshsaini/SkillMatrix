import React, { useState } from 'react';
import { Zap, Check, Shield, BadgeCheck, ArrowRight, Home, User, Settings, Mail, Phone } from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';


const Billing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Navigation */}
     <Navigation/>

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Choose the plan that's right for you. Switch or cancel anytime.
            </p>
            
            {/* Toggle */}
            <div className="mt-8 flex items-center justify-center">
              <span className={`mr-4 text-sm font-medium ${activePlan === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setActivePlan(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    activePlan === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-4 text-sm font-medium ${activePlan === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual <span className="text-blue-600">(Save 17%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {plans[activePlan].map((plan, index) => (
              <div 
                key={`${activePlan}-${index}`} 
                className={`relative rounded-2xl border ${
                  plan.recommended 
                    ? 'border-blue-500 bg-white shadow-xl ring-1 ring-blue-500' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center justify-center px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h2 className="text-lg font-medium text-gray-900">
                    {plan.name}
                    {plan.recommended && <span className="ml-2 text-blue-500">★</span>}
                  </h2>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold">/{plan.period}</span>
                  </p>
                  {plan.savings && (
                    <p className="mt-2 text-sm text-blue-600">{plan.savings}</p>
                  )}
                  <p className="mt-2 font-medium text-blue-600">{plan.deals}</p>
                  <p className="mt-2 text-gray-500">Perfect for {plan.name.toLowerCase()} users</p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`mt-8 w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      plan.recommended 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">Frequently asked questions</h2>
            
            <dl className="mt-12 space-y-10">
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
                }
              ].map((faq, index) => (
                <div key={index} className="pt-6">
                  <dt className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default Billing;