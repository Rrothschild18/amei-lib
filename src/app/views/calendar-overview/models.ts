export const MAX_WEEK_DAYS = 7;

export enum WeekDays {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export type CalendarWeek = {
  [key in WeekDaysNumbers]: {
    date: Date;
    dayOfWeekName: WeekDays;
    monthDay: number;
  };
};

export type WeekDaysNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6;
