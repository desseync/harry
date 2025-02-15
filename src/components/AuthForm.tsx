import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<string>('');

  useEffect(() => {
    // Check configuration on component mount
    const checkConfig = () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      let status = 'Configuration Status:\n';
      status += `URL: ${url ? '✓ Present' : '✗ Missing'}\n`;
      status += `Key: ${key ? '✓ Present' : '✗ Missing'}\n`;
      
      if (url) {
        status += `URL Format: ${url.startsWith('https://') && url.endsWith('.supabase.co') ? '✓ Valid' : '✗ Invalid'}\n`;
      }
      
      setConfigStatus(status);
    };
    
    checkConfig();
  }, []);

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format the number as +1-XXX-XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
    return `+1-${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Check if the phone number matches the format +1-XXX-XXX-XXXX or XXX-XXX-XXXX
    const phoneRegex = /^(\+1-)?[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      setError(`Authentication service configuration issue detected:\n${configStatus}`);
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
      } else {
        // Validate required fields for registration
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('First name and last name are required');
        }

        if (!validatePhoneNumber(phoneNumber)) {
          throw new Error('Please enter a valid phone number in the format: +1-XXX-XXX-XXXX');
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/member`,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone_number: phoneNumber,
              sms_opt_in: smsOptIn,
              email_confirmed: true
            }
          },
        });
        
        if (signUpError) throw signUpError;
        
        setSuccessMessage('Account created successfully! You can now sign in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || (isLogin
        ? 'Failed to sign in. Please check your credentials and try again.'
        : 'Failed to create account. Please try again.'
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  required={!isLogin}
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  required={!isLogin}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required={!isLogin}
                placeholder="+1-XXX-XXX-XXXX"
                maxLength={14}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Format: +1-XXX-XXX-XXXX
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="smsOptIn"
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
              />
              <label htmlFor="smsOptIn" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to receive SMS notifications and enable two-factor authentication
              </label>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            required
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            required
            minLength={6}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {!isLogin && 'Password must be at least 6 characters long'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition ${
            loading
              ? 'opacity-75 cursor-not-allowed'
              : 'hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setSuccessMessage(null);
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setSmsOptIn(false);
          }}
          className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}