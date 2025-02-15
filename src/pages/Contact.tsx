import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Contact() {
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
              <Link to="/#features" className="animated-link">Features</Link>
              <Link to="/#pricing" className="animated-link">Pricing</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Contact Form Section */}
      <div className="flex justify-center items-start pt-8 pb-20">
        <div className="w-full max-w-2xl px-4">
          <h1 className="text-3xl font-bold text-center mb-8 font-display">Contact Us</h1>
          <ContactForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Frequency AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}