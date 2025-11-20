import React from 'react';
import { ExchangePlatform } from '../types';

interface PlatformCardProps {
  platform: ExchangePlatform;
  sourceAmount: number;
  sourceCurrency: string;
  onTrackClick?: (name: string) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, sourceAmount, sourceCurrency, onTrackClick }) => {
  
  const handleLinkClick = (e: React.MouseEvent) => {
    if (onTrackClick) {
      onTrackClick(platform.name);
    }
    // Allow default behavior (navigation) if link exists, handled by anchor tag or parent
  };

  const destinationUrl = platform.link || '#';

  return (
    <div className={`relative bg-white rounded-xl p-5 border transition-all duration-300 ${platform.isBestValue ? 'border-brand-500 shadow-lg scale-[1.01] z-10' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
      
      {/* Badges */}
      <div className="absolute -top-3 left-5 flex gap-2">
        {platform.isBestValue && (
          <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
            Best Value
          </span>
        )}
        {platform.isFastest && (
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
            Fastest
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
              {platform.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">{platform.name}</h3>
              
              {/* Delivery Estimate with Icon */}
              <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75l4 2.5a.75.75 0 00.75-1.3l-3.25-2.031V5z" clipRule="evenodd" />
                </svg>
                <span>{platform.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 pl-1">
            <div className="flex items-center text-sm text-gray-600 justify-between max-w-xs border-b border-dotted border-gray-200 pb-1">
              <span className="">Rate</span>
              <span className="font-medium text-gray-900">1 {sourceCurrency} = {platform.rate.toFixed(4)} {platform.currency}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 justify-between max-w-xs border-b border-dotted border-gray-200 pb-1">
              <span className="">Transfer Fee</span>
              <span className="font-medium text-gray-900">
                 {platform.transferFee === 0 ? 'Free' : `${platform.transferFee.toFixed(2)} ${sourceCurrency}`}
              </span>
            </div>
          </div>
          
          {/* Referral Bonus Highlight */}
          {platform.referralBonus && platform.referralBonus !== 'None' && (
             <div className="mt-4 inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-100 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500">
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM15.657 14.596a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06zM6.464 5.404a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06z" />
                </svg>
                <span><span className="font-bold">Bonus:</span> {platform.referralBonus}</span>
             </div>
          )}
        </div>

        {/* Right: Outcome & Action */}
        <div className="flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0 min-w-[200px]">
            <div className="text-right mb-4">
                <span className="block text-sm text-gray-500 mb-1">Recipient gets</span>
                <span className="block text-3xl font-bold text-brand-600 tracking-tight">
                    {platform.totalReceiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                </span>
                <span className="text-sm font-semibold text-gray-400">{platform.currency}</span>
            </div>
            <a 
              href={destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className={`w-full text-center py-3 px-4 rounded-xl font-bold transition-all active:scale-95 ${platform.isBestValue ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
                Go to {platform.name}
            </a>
        </div>
      </div>
    </div>
  );
};