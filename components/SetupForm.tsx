import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface SetupFormProps {
  onStart: (subject: string, hours: number) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && hours) {
      onStart(subject.trim(), parseFloat(hours));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto fade-in">
      <h1 className="text-2xl font-light text-zinc-500 mb-12 tracking-tight">New Session</h1>
      
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        <div className="group relative">
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="block w-full bg-transparent border-b border-zinc-800 text-xl text-center text-zinc-200 py-2 focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-800"
            placeholder="Subject Name"
            autoComplete="off"
            autoFocus
          />
          <label 
            htmlFor="subject" 
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-zinc-600 uppercase tracking-widest pointer-events-none transition-all group-focus-within:text-zinc-400"
          >
            Subject
          </label>
        </div>

        <div className="group relative">
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="block w-full bg-transparent border-b border-zinc-800 text-xl text-center text-zinc-200 py-2 focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-800"
            placeholder="0"
            min="0.5"
            step="0.5"
          />
          <label 
            htmlFor="hours" 
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-zinc-600 uppercase tracking-widest pointer-events-none transition-all group-focus-within:text-zinc-400"
          >
            Target Hours
          </label>
        </div>

        <div className="pt-8 flex justify-center">
          <Button 
            type="submit" 
            disabled={!subject || !hours}
            size="lg"
            className="flex items-center gap-2 pl-6 pr-4 group"
          >
            Start Focus
            <ArrowRight size={16} className="text-zinc-400 group-hover:text-black transition-colors" />
          </Button>
        </div>
      </form>
    </div>
  );
};
