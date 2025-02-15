import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Clock, BarChart, Shield, Bot, Sparkles } from 'lucide-react';

export default function AutomationBenefits() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">Frequency AI</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="animated-link">Home</Link>
              <a href="#benefits" className="animated-link">Benefits</a>
              <a href="#implementation" className="animated-link">Implementation</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group">
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-display">
            Transform Your Practice with AI-Powered Automation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover how intelligent automation can revolutionize your psychiatric practice, 
            improve patient care, and boost operational efficiency.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-display">
            Key Benefits of Practice Automation
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                title: "Time Savings",
                description: "Reduce administrative workload by up to 70% through automated scheduling, documentation, and follow-ups."
              },
              {
                icon: <BarChart className="h-8 w-8 text-blue-600" />,
                title: "Improved Efficiency",
                description: "Streamline workflows and eliminate repetitive tasks, allowing your team to focus on patient care."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Enhanced Accuracy",
                description: "Minimize human error in documentation and data entry with AI-powered verification systems."
              },
              {
                icon: <Bot className="h-8 w-8 text-blue-600" />,
                title: "24/7 Availability",
                description: "Provide automated responses and support to patients outside of office hours."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-blue-600" />,
                title: "Better Patient Experience",
                description: "Deliver faster response times and more personalized care through intelligent automation."
              },
              {
                icon: <Brain className="h-8 w-8 text-blue-600" />,
                title: "Data-Driven Insights",
                description: "Gain valuable insights from automated data collection and analysis to improve care quality."
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300 benefit-container"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section id="implementation" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-display">
            Implementation Process
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Assessment",
                  description: "We analyze your current workflows and identify automation opportunities."
                },
                {
                  step: "2",
                  title: "Custom Solution Design",
                  description: "Our team develops a tailored automation strategy for your practice."
                },
                {
                  step: "3",
                  title: "Integration",
                  description: "Seamless implementation with your existing systems and workflows."
                },
                {
                  step: "4",
                  title: "Training",
                  description: "Comprehensive training for your team on the new automated systems."
                },
                {
                  step: "5",
                  title: "Ongoing Support",
                  description: "Continuous monitoring and optimization of your automation solutions."
                }
              ].map((phase, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {phase.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us help you implement intelligent automation solutions that will revolutionize 
            your practice and improve patient care.
          </p>
          <Link 
            to="/#contact" 
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">LinkedIn</li>
                <li className="text-gray-400">X</li>
                <li className="text-gray-400">Facebook</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Frequency AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}