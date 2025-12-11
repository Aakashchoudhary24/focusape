import React from 'react';
import { formatTime } from '../utils/time';

interface TimerDisplayProps {
  elapsedSeconds: number;
  isRunning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedSeconds, isRunning }) => {
  return (
    <div
      className={`text-6xl sm:text-8xl md:text-9xl font-mono tabular-nums tracking-tighter select-none transition-colors duration-500 ${
        isRunning ? 'text-zinc-300' : 'text-zinc-500'
      }`}
    >
      {formatTime(elapsedSeconds)}
    </div>
  );
};
