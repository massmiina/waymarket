'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald hover:bg-emerald-hover text-sm font-black rounded-xl h-12 shadow-neon uppercase tracking-widest transition-all',
              card: 'shadow-2xl shadow-emerald-900/5 border border-white rounded-[32px] overflow-hidden',
              headerTitle: 'text-forest-green font-black tracking-tighter text-2xl font-[family-name:var(--font-playfair)] italic',
              headerSubtitle: 'text-slate-400 font-medium',
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
