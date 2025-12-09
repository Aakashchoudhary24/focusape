export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  // If we have hours, show HH:MM:SS, otherwise MM:SS is usually fine 
  // but for study tracking usually HH:MM:SS is preferred always to see scale.
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatHours = (hours: number): string => {
  return hours === 1 ? '1 hour' : `${hours} hours`;
};
