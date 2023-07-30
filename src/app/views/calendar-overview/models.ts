export const MAX_WEEK_DAYS = 7;
export const NUMBER_OF_DAYS_IN_WEEK = 7;
export const MAX_CALENDAR_SLOT_DAYS = 42;
export const FIRST_MONTH_DAY = 1;

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

export type CalendarSlots = {
  [key: number]: {
    date: Date;
    dayOfWeekName: WeekDays;
    monthDay: number;
  };
};

export type WeekDaysNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6;
