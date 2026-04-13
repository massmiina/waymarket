'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-bold rounded-xl h-12',
              card: 'shadow-sm border border-gray-100 rounded-2xl',
              headerTitle: 'text-gray-900 font-extrabold',
              headerSubtitle: 'text-gray-500',
            }
          }}
          fallbackRedirectUrl="/"
          signUpUrl="/auth/sign-up"
          path="/auth"
        />
      </div>
    </div>
  );
}
