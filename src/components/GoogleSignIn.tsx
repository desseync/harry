import React from 'react';
import { LogIn } from 'lucide-react';

interface GoogleSignInProps {
  onSignIn: () => Promise<void>;
  isLoading?: boolean;
}

export default function GoogleSignIn({ onSignIn, isLoading = false }: GoogleSignInProps) {
  return (
    <button
      onClick={onSignIn}
      disabled={isLoading}
      className="group relative flex w-full max-w-sm mx-auto justify-center items-center space-x-3 px-6 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="#4285f4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
          </div>
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </>
      )}
    </button>
  );
}