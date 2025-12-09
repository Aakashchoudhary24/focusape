import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Cap visual progress at 100%
  const visualProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full h-1 bg-zinc-900 overflow-hidden relative mt-8">
      <div 
        className="h-full bg-zinc-200 transition-all duration-500 ease-out"
        style={{ width: `${visualProgress}%` }}
      />
    </div>
  );
};
