export interface StudySession {
  subject: string;
  targetHours: number;
  elapsedSeconds: number;
  isRunning: boolean;
  lastTickTimestamp?: number;
}
