import React from 'react';
import { Currency } from '../types';

interface CurrencyInputProps {
  label: string;
  amount: number;
  currency: string;
  onAmountChange?: (val: number) => void;
  onCurrencyChange: (val: string) => void;
  currencies: Currency[];
  readOnlyAmount?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies,
  readOnlyAmount = false,
}) => {
  return (
    <div className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500 transition-all duration-200">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-brand-600 transition-colors">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {readOnlyAmount ? (
            <div className="text-3xl font-bold text-slate-400 cursor-not-allowed tracking-tight">
              {amount > 0 ? amount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '---'}
            </div>
          ) : (
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange?.(parseFloat(e.target.value) || 0)}
              className="w-full text-3xl font-bold text-slate-700 outline-none placeholder-slate-200 bg-transparent tracking-tight"
              placeholder="1000"
            />
          )}
        </div>
        <div className="relative min-w-[100px]">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 pl-4 pr-10 rounded-xl outline-none cursor-pointer transition-colors border border-transparent hover:border-slate-200 focus:border-brand-500 focus:bg-white"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};