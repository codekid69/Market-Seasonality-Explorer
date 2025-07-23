
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';


export const getCalendarDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
};


export const getWeekDays = (currentDate: Date): Date[] => {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });

  return eachDayOfInterval({
    start,
    end,
  });
};
export const formatCalendarDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date) => {
  return format(date, 'MMMM yyyy');
};

export const formatDayNumber = (date: Date) => {
  return format(date, 'd');
};

export const formatWeekday = (date: Date, short: boolean = true) => {
  return format(date, short ? 'EEE' : 'EEEE');
};
export const isCurrentMonth = (date: Date, currentMonth: Date) => {
  return date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear();
};

export const isTodayDate = (date: Date) => {
  return isToday(date);
};

export const isSameDate = (date1: Date, date2: Date) => {
  return isSameDay(date1, date2);
};

export const getPerformanceColor = (performance: number, theme: 'light' | 'dark' = 'light') => {
  const baseColors = {
    strongPositive: theme === 'light' ? '#0d7377' : '#14a085',
    positive: theme === 'light' ? '#2e8b57' : '#3cb371',
    neutral: theme === 'light' ? '#6b7280' : '#9ca3af',
    negative: theme === 'light' ? '#dc2626' : '#ef4444',
    strongNegative: theme === 'light' ? '#991b1b' : '#dc2626',
    noData: theme === 'light' ? '#f8fafc' : '#1e293b',
  };

  if (performance > 3) return baseColors.strongPositive;
  if (performance > 1) return baseColors.positive;
  if (performance < -3) return baseColors.strongNegative;
  if (performance < -1) return baseColors.negative;
  if (Math.abs(performance) > 0.1) return baseColors.neutral;
  return baseColors.noData;
};

export const getVolatilityIntensity = (volatility: number) => {
  if (volatility > 5) return 1.0; // Extreme volatility
  if (volatility > 3) return 0.7; // High volatility
  if (volatility > 1.5) return 0.4; // Medium volatility
  return 0.1; // Low volatility
};

export const isMarketOpen = (date: Date) => {
  const day = date.getDay();
  const hour = date.getHours();
 
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 16;
};