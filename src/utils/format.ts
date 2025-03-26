export function formatRecord(wins: number, losses: number, draws: number): string {
  return `${wins}-${losses}${draws > 0 ? `-${draws}` : ''}`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%';
  return formatPercentage(correct / total);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatOdds(odds: number): string {
  if (odds >= 0) {
    return `+${odds}`;
  }
  return odds.toString();
}

export function formatRound(round: number): string {
  if (round === 1) return '1st';
  if (round === 2) return '2nd';
  if (round === 3) return '3rd';
  return `${round}th`;
}

export function formatWeight(weight: number): string {
  return `${weight} lbs`;
}

export function formatHeight(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

export function formatReach(inches: number): string {
  return `${inches}"`;
} 