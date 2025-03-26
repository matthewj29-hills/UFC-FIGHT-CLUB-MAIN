export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date.toString())} at ${formatTime(date.toString())}`;
}

export function isInPast(date: string | Date): boolean {
  return new Date(date) < new Date();
}

export function isInFuture(date: string | Date): boolean {
  return new Date(date) > new Date();
}

export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

export function daysUntil(date: string | Date): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function timeUntil(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return 'Event has ended';
  }

  const days = Math.floor(diffInSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} away`;
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} away`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} away`;
  }

  return 'Starting soon';
}

export function formatRound(round: number): string {
  return `Round ${round}`;
}

export function isEventToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isEventLive(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  // Consider an event "live" if it started within the last 6 hours
  return diffInHours >= 0 && diffInHours <= 6;
}

export function getEventStatus(dateString: string): 'upcoming' | 'live' | 'completed' {
  const date = new Date(dateString);
  const now = new Date();
  
  if (isEventLive(dateString)) {
    return 'live';
  }
  
  return now < date ? 'upcoming' : 'completed';
} 