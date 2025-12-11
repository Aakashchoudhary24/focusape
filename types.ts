export interface StudySession {
  subject: string;
  targetHours: number;

  // The canonical persisted fields we now use:
  accumulatedSeconds: number;    // total seconds from previous runs (paused durations)
  startTimestamp: number | null; // Date.now() in ms when the timer was last started; null if paused/stopped
  isRunning: boolean;

  // NOTE: older saves may have `elapsedSeconds` — loading logic in App will migrate those.
}
