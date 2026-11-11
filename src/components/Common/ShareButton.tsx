import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { buildCalculatorUrl } from '../../utils/urlState';
import { CalculatorId } from '../../types';

interface ShareButtonProps {
  calculatorId: CalculatorId;
  params: Record<string, string | number | boolean>;
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  calculatorId,
  params,
  label = 'Share Calculation',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const relativeUrl = buildCalculatorUrl(calculatorId, params);
    const fullUrl = `${window.location.origin}${window.location.pathname}${relativeUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      prompt('Copy this link:', fullUrl);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
          copied
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm'
        }`}
        title="Share link with prefilled values"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Floating subtle tooltip on copied */}
      {copied && (
        <div className="absolute right-0 -top-8 bg-slate-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-md pointer-events-none whitespace-nowrap animate-fade-in">
          Direct link with your values copied!
        </div>
      )}
    </div>
  );
};

