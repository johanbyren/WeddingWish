import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
}

export function ProgressBar({ current, target, className = "" }: ProgressBarProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isFullyFunded = current >= target;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{current.toLocaleString()} SEK</span>
        <span>{target.toLocaleString()} SEK</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isFullyFunded 
              ? 'bg-green-500' 
              : 'bg-pink-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{percentage.toFixed(1)}% funded</span>
        {isFullyFunded && (
          <span className="text-green-600 font-medium">✓ Fully funded!</span>
        )}
      </div>
    </div>
  );
}
