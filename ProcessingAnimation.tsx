import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  "Connecting to global exchanges...",
  "Fetching real-time rates...",
  "Analyzing hidden fees...",
  "Checking transfer speeds...",
  "Scanning for referral bonuses...",
  "Finalizing best value..."
];

export const ProcessingAnimation: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      <div className="relative">
        {/* Ping Effect */}
        <div className="absolute inset-0 bg-brand-500 rounded-full opacity-20 animate-ping"></div>
        
        {/* Central Icon */}
        <div className="relative bg-white p-5 rounded-full shadow-xl border border-brand-100 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-brand-600 animate-spin-slow">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
           </svg>
        </div>
      </div>

      {/* Text Updates */}
      <div className="text-center space-y-2 max-w-xs">
        <h3 className="text-lg font-bold text-slate-800 transition-all duration-500 ease-in-out min-h-[28px]">
          {LOADING_STEPS[stepIndex]}
        </h3>
        <p className="text-sm text-slate-400">Powered by AI Analysis</p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 animate-pulse-fast w-1/2 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};