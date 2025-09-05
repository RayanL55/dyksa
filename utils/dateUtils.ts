export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDaysUntil(date: Date): number {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getNextRenewalDate(
  currentDate: Date,
  billingPeriod: 'monthly' | 'yearly' | 'custom',
  customDays?: number
): Date {
  const date = new Date(currentDate);
  
  switch (billingPeriod) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'custom':
      if (customDays) {
        date.setDate(date.getDate() + customDays);
      }
      break;
  }
  
  return date;
}