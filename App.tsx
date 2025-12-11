import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Grain } from './components/Grain';
import { SetupForm } from './components/SetupForm';
import { TimerDisplay } from './components/TimerDisplay';
import { ProgressBar } from './components/ProgressBar';
import { Button } from './components/Button';
import { StudySession } from './types';

const STORAGE_KEY = 'study_timer_v1';

// Helper to migrate older saved shape to the new StudySession shape
const migrateSaved = (raw: any): StudySession => {
  // if already has accumulatedSeconds/startTimestamp -> assume new shape
  if (raw && typeof raw === 'object' && ('accumulatedSeconds' in raw || 'startTimestamp' in raw)) {
    return {
      subject: raw.subject ?? '',
      targetHours: Number(raw.targetHours ?? 0),
      accumulatedSeconds: Number(raw.accumulatedSeconds ?? 0),
      startTimestamp: raw.startTimestamp ?? null,
      isRunning: Boolean(raw.isRunning ?? false),
    };
  }

  // fallback: old shape with elapsedSeconds
  return {
    subject: raw?.subject ?? '',
    targetHours: Number(raw?.targetHours ?? 0),
    accumulatedSeconds: Number(raw?.elapsedSeconds ?? 0),
    startTimestamp: raw?.isRunning ? Date.now() : null,
    isRunning: Boolean(raw?.isRunning ?? false),
  };
};

const App: React.FC = () => {
  // keep a separate "now" state to drive visible ticking (timestamp-based)
  const [now, setNow] = useState<number>(Date.now());

  // Initialize session and migrate older saves if present
  const [session, setSession] = useState<StudySession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateSaved(parsed);
      }
    } catch (e) {
      console.error('Failed to load session', e);
    }

    return {
      subject: '',
      targetHours: 0,
      accumulatedSeconds: 0,
      startTimestamp: null,
      isRunning: false,
    };
  });

  const intervalRef = useRef<number | null>(null);

  // Persist session changes to localStorage (debounced enough by React)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to persist session', e);
    }
  }, [session]);

  // Tick effect: while running, update `now` every 1s to re-render display.
  useEffect(() => {
    if (session.isRunning) {
      // ensure startTimestamp exists — if migrated from old data where isRunning was true,
      // we set startTimestamp during migration to Date.now(), so this should be ok.
      if (!session.startTimestamp) {
        setSession(prev => ({ ...prev, startTimestamp: Date.now() }));
      }

      intervalRef.current = window.setInterval(() => {
        setNow(Date.now());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // ensure we update now once on stop so UI reflects immediate change
      setNow(Date.now());
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // only depend on isRunning — no need to recreate interval for other session changes
  }, [session.isRunning]);

  // Derived elapsed seconds (never stored as ticking +1 to avoid drift)
  const getCurrentElapsedSeconds = (): number => {
    const base = session.accumulatedSeconds || 0;
    if (session.isRunning && session.startTimestamp) {
      const extra = Math.floor((now - session.startTimestamp) / 1000);
      return base + extra;
    }
    return base;
  };

  // --- Handlers ---
  const handleStartSetup = (subject: string, hours: number) => {
    setSession({
      subject,
      targetHours: hours,
      accumulatedSeconds: 0,
      startTimestamp: Date.now(),
      isRunning: true,
    });
    setNow(Date.now());
  };

  const toggleTimer = useCallback(() => {
    setSession(prev => {
      // if running -> pause and accumulate
      if (prev.isRunning) {
        const extra = prev.startTimestamp ? Math.floor((Date.now() - prev.startTimestamp) / 1000) : 0;
        return {
          ...prev,
          accumulatedSeconds: prev.accumulatedSeconds + extra,
          startTimestamp: null,
          isRunning: false,
        };
      }

      // if paused -> start/resume
      return {
        ...prev,
        startTimestamp: Date.now(),
        isRunning: true,
      };
    });
    setNow(Date.now());
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to end this session? All progress for this subject will be reset.')) {
      setSession({
        subject: '',
        targetHours: 0,
        accumulatedSeconds: 0,
        startTimestamp: null,
        isRunning: false,
      });
      setNow(Date.now());
    }
  }, []);

  // --- Derived State ---
  const hasActiveSession = session.subject !== '' && session.targetHours > 0;
  const elapsedSeconds = getCurrentElapsedSeconds();
  const progressPercentage = hasActiveSession ? (elapsedSeconds / (session.targetHours * 3600)) * 100 : 0;

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
              <span className="text-zinc-500 text-lg mt-2 font-mono">Target: {session.targetHours}h</span>
            </div>

            {/* Timer */}
            <div className="mb-16">
              <TimerDisplay elapsedSeconds={elapsedSeconds} isRunning={session.isRunning} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mb-12">
              <Button onClick={toggleTimer} size="lg" className="w-32 flex justify-center items-center">
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

            {/* Progress Bar */}
            <div className="w-full max-w-lg space-y-2">
              <div className="flex justify-between text-xs text-zinc-300 font-mono uppercase tracking-wider">
                <span>Progress</span>
                <span>{Math.floor(progressPercentage)}%</span>
              </div>
              <ProgressBar progress={progressPercentage} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full z-10 pointer-events-none hover:opacity-50 transition-opacity">
        <p className="text-[15px] text-zinc-400 font-mono">FOCUS V1.0</p>
      </div>
    </div>
  );
};

export default App;
