import React from 'react';
import { useTranslation } from '~/context/translation';
import { getThemeConfig } from '~/utils/themes';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  themeColor?: string;
}

export function LoadingSpinner({ size = 'md', className = '', text, themeColor }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinnerColor = themeColor || '#ec4899'; // Default to pink if no theme color

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        style={{ color: spinnerColor }}
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p 
          className={`font-medium ${textSizeClasses[size]}`}
          style={{ color: spinnerColor }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Neutral loading spinner (no theme colors)
export function NeutralLoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size]} text-gray-600`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full screen loading component
export function FullScreenLoading({ 
  text, 
  theme, 
  primaryColor 
}: { 
  text?: string;
  theme?: string;
  primaryColor?: string;
}) {
  const { t } = useTranslation();
  
  // Get theme config if theme data is provided
  let themeConfig = null;
  if (theme && primaryColor) {
    try {
      themeConfig = getThemeConfig(theme, primaryColor);
    } catch (error) {
      console.warn('Could not load theme config for loading spinner:', error);
    }
  }
  
  // If no theme data, use neutral loading
  if (!themeConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <NeutralLoadingSpinner 
            size="lg" 
            text={text || t('common.loading')} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{ 
        background: themeConfig.colors.background 
      }}
    >
      <div className="text-center">
        <LoadingSpinner 
          size="lg" 
          text={text || t('common.loading')} 
          themeColor={themeConfig.colors.primary}
        />
      </div>
    </div>
  );
}

// Overlay loading component
export function OverlayLoading({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="md" text={text || t('common.loading')} />
    </div>
  );
}

// Button loading spinner
export function ButtonLoadingSpinner() {
  return (
    <svg 
      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
