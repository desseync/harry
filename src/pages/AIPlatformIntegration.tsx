import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, ChevronRight, Layers, Zap, Lock, Database, Network, Cpu } from 'lucide-react';
import FeatureSection from '../components/FeatureSection';

export default function AIPlatformIntegration() {
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
              <a 
                href="#features-heading" 
                className="animated-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features-heading')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a href="#process" className="animated-link">Process</a>
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-display">
                Seamless AI Platform Integration
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your practice with our state-of-the-art AI integration solutions. We seamlessly 
                incorporate advanced artificial intelligence into your existing systems, enhancing efficiency 
                and improving patient care without disrupting your workflow.
              </p>
              <a href="#features" 
                className="animated-button bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center space-x-2 inline-flex"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Integration Features</span>
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                alt="Advanced technology integration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <FeatureSection />

      {/* Integration Process */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-display">
            Integration Process
          </h2>
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Initial Assessment",
                description: "We analyze your current systems and workflows to design the optimal integration strategy."
              },
              {
                step: "2",
                title: "Custom Integration Plan",
                description: "Development of a tailored integration plan that aligns with your specific needs and objectives."
              },
              {
                step: "3",
                title: "Implementation",
                description: "Careful execution of the integration plan with minimal disruption to your daily operations."
              },
              {
                step: "4",
                title: "Testing & Validation",
                description: "Comprehensive testing to ensure all systems are working seamlessly together."
              },
              {
                step: "5",
                title: "Training & Support",
                description: "Thorough staff training and ongoing technical support to ensure smooth adoption."
              }
            ].map((phase, index) => (
              <div key={index} className="flex items-start space-x-4 mb-12 last:mb-0">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  {phase.step}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">
            Ready to Integrate AI into Your Practice?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us help you implement our AI solutions seamlessly into your existing systems.
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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