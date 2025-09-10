import React from 'react';
import { Card, CardContent } from '~/components/ui/card';

interface Contributor {
  id: string;
  contributorName: string;
  amount: number;
  message: string;
  createdAt: string;
  type: 'swish' | 'stripe';
}

interface ContributorListProps {
  contributors: Contributor[];
  showAmounts?: boolean;
  maxDisplay?: number;
}

export function ContributorList({ contributors, showAmounts = true, maxDisplay = 3 }: ContributorListProps) {
  if (contributors.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-4 text-center">
        No contributions yet
      </div>
    );
  }

  const displayContributors = contributors.slice(0, maxDisplay);
  const remainingCount = contributors.length - maxDisplay;

  return (
    <div className="space-y-1">
      {displayContributors.map((contributor) => (
        <div key={contributor.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {contributor.contributorName}
              </p>
              {contributor.message && (
                <span className="text-xs text-gray-500 truncate max-w-xs">
                  "{contributor.message}"
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {new Date(contributor.createdAt).toLocaleDateString()}
            </p>
          </div>
          {showAmounts && (
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {contributor.amount.toLocaleString()} SEK
              </p>
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="text-sm text-gray-500 text-center py-2 border-t border-gray-200 mt-2">
          +{remainingCount} more contribution{remainingCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
