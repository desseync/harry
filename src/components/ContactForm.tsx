import React, { useState, useEffect } from 'react';
import { submitContactForm } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatPhoneNumber } from '../lib/validation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Handle form data persistence using pagehide event
    const handlePageHide = (e: PageTransitionEvent) => {
      if (Object.values(formData).some(value => value)) {
        // Store form data in sessionStorage
        sessionStorage.setItem('contactFormData', JSON.stringify(formData));
      }
    };

    // Restore form data if it exists
    const savedFormData = sessionStorage.getItem('contactFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        // Clear the stored data after restoring
        sessionStorage.removeItem('contactFormData');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }

    window.addEventListener('pagehide', handlePageHide);
    
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!isSupabaseConfigured()) {
      setErrors({
        submit: 'Contact form is temporarily unavailable. Please try again later or contact us directly.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          website: '',
          message: ''
        });
        // Clear stored form data on successful submission
        sessionStorage.removeItem('contactFormData');
      } else {
        setErrors(response.errors || { submit: response.message });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
      
      {submitSuccess ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
          Thank you for your message. We'll get back to you soon!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="XXX-XXX-XXXX"
              maxLength={12}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.phone ? 'true' : 'false'}
              required
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">Format: XXX-XXX-XXXX</p>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Business Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              autoComplete="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.website ? 'true' : 'false'}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.message ? 'true' : 'false'}
              required
            />
            <div className="mt-1 flex justify-between">
              {errors.message ? (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  {formData.message.length}/500 characters
                </p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition ${
              isSubmitting
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <p className="text-sm text-gray-600 mt-4">
            By submitting this form, you agree to our privacy policy. Your information will be used
            solely for the purpose of responding to your inquiry and will not be shared with third
            parties without your consent.
          </p>
        </form>
      )}
    </div>
  );
}