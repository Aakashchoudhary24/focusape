import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Grain } from './components/Grain';
import { SetupForm } from './components/SetupForm';
import { TimerDisplay } from './components/TimerDisplay';
import { ProgressBar } from './components/ProgressBar';
import { Button } from './components/Button';
import { StudySession } from './types';

const STORAGE_KEY = 'study_timer_v1';

const App: React.FC = () => {
  // --- State ---
  // We initialize state lazily from localStorage to persist data
  const [session, setSession] = useState<StudySession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load session", e);
    }
    return {
      subject: '',
      targetHours: 0,
      elapsedSeconds: 0,
      isRunning: false
    };
  });

  const intervalRef = useRef<number | null>(null);

  // --- Effects ---

  // Persist session changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  // Timer interval logic
  useEffect(() => {
    if (session.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSession(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        }));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session.isRunning]);

  // --- Handlers ---

  const handleStartSetup = (subject: string, hours: number) => {
    setSession({
      subject,
      targetHours: hours,
      elapsedSeconds: 0,
      isRunning: true,
    });
  };

  const toggleTimer = useCallback(() => {
    setSession(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to end this session? All progress for this subject will be reset.")) {
      setSession({
        subject: '',
        targetHours: 0,
        elapsedSeconds: 0,
        isRunning: false
      });
    }
  }, []);

  // --- Derived State ---

  const hasActiveSession = session.subject !== '' && session.targetHours > 0;
  const progressPercentage = hasActiveSession 
    ? (session.elapsedSeconds / (session.targetHours * 3600)) * 100 
    : 0;

  // --- Render ---

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 selection:bg-zinc-800 selection:text-zinc-200">
      <Grain />
      
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {!hasActiveSession ? (
          <SetupForm onStart={handleStartSetup} />
        ) : (
          <div className="w-full flex flex-col items-center fade-in">
            {/* Header Info */}
            <div className="flex flex-col items-center gap-2 mb-16 text-center">
              <h2 className="text-zinc-500 text-sm uppercase tracking-widest">Studying</h2>
              <h1 className="text-3xl md:text-4xl text-zinc-100 font-light tracking-tight">{session.subject}</h1>
              <span className="text-zinc-600 text-xs mt-2 font-mono">
                Target: {session.targetHours}h
              </span>
            </div>

            {/* Timer */}
            <div className="mb-16">
              <TimerDisplay 
                elapsedSeconds={session.elapsedSeconds} 
                isRunning={session.isRunning} 
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mb-12">
              <Button 
                onClick={toggleTimer} 
                size="lg"
                className="w-32 flex justify-center items-center"
              >
                {session.isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </Button>
              
              <button 
                onClick={handleReset}
                className="p-4 rounded-full text-zinc-700 hover:text-red-500 hover:bg-zinc-900/50 transition-all"
                title="Reset Session"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Progress Bar - Sticky/Fixed at bottom of container or inline */}
            <div className="w-full max-w-lg space-y-2">
              <div className="flex justify-between text-xs text-zinc-600 font-mono uppercase tracking-wider">
                <span>Progress</span>
                <span>{Math.floor(progressPercentage)}%</span>
              </div>
              <ProgressBar progress={progressPercentage} />
            </div>

          </div>
        )}
      </div>

      {/* Footer / Copyright - very subtle */}
      <div className="absolute bottom-4 text-center w-full z-10 pointer-events-none opacity-20 hover:opacity-50 transition-opacity">
        <p className="text-[10px] text-zinc-500 font-mono">FOCUS // V1.0</p>
      </div>
    </div>
  );
};

export default App;
