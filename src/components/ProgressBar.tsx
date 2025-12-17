import React from 'react';
import { getColorByScore, AppMode } from '../utils';

interface ProgressBarProps {
  percentage: number;
  mode: AppMode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, mode }) => {
  const colorClass = getColorByScore(percentage, mode);
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-200 shadow-inner overflow-hidden border-2 border-white">
      <div 
        className={`${colorClass} h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`} 
        style={{ width: `${percentage}%` }}
      >
        {percentage > 10 && (
          <span className="text-white text-xs font-bold animate-pulse">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};