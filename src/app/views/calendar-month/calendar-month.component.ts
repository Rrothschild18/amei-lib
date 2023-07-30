import { Component, OnInit } from '@angular/core';
import {
  CalendarSlots,
  WeekDays,
  MAX_WEEK_DAYS,
  MAX_CALENDAR_SLOT_DAYS,
  FIRST_MONTH_DAY,
  NUMBER_OF_DAYS_IN_WEEK,
} from '../calendar-overview/models';

@Component({
  selector: 'app-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
})
export class CalendarMonthComponent implements OnInit {
  month: string = 'month';
  year: number = 2023;
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hoursOfDay = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  WeekDays = WeekDays;
  FIRST_MONTH_DAY = FIRST_MONTH_DAY;
  NUMBER_OF_DAYS_IN_WEEK = NUMBER_OF_DAYS_IN_WEEK;

  today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  today2 = new Date().toISOString();

  today3 = new Date(this.today2);

  currentMonthSlots: CalendarSlots = {} as CalendarSlots;

  constructor() {}

  ngOnInit(): void {
    this.calculateCurrentWeekDays();
    console.log(this.currentMonthSlots);
  }

  calculateCurrentWeekDays() {
    const daysToFirstMonthDay: WeekDays = this.today3.getUTCDate() - 1;
    const firstMonthDay = this.today3;
    firstMonthDay.setDate(firstMonthDay.getDate() - daysToFirstMonthDay);

    const firstMothDayUTC = firstMonthDay.getUTCDay();

    const days: Date[] = Array.from(
      { length: MAX_CALENDAR_SLOT_DAYS },
      (_, day) => {
        const currentDate = new Date(firstMonthDay);
        currentDate.setDate(currentDate.getDate() + (day - firstMothDayUTC));

        return currentDate;
      }
    );

    debugger;

    this.currentMonthSlots = days.reduce(
      (accMonth: CalendarSlots, currentMonthDay: Date, dayOfMonth: number) => {
        return {
          ...accMonth,
          [dayOfMonth]: {
            date: currentMonthDay,
            dayOfWeekName: currentMonthDay.toLocaleString('en-US', {
              weekday: 'short',
            }),
            monthDay: currentMonthDay.getUTCDate(),
          },
        } as CalendarSlots;
      },
      {}
    );
    debugger;
  }

  getWeekName(day: number) {
    return this.currentMonthSlots[day as keyof CalendarSlots].dayOfWeekName;
  }

  getMonthDay(day: number) {
    return this.currentMonthSlots[day as keyof CalendarSlots].monthDay;
  }
}
