import { Component, OnInit } from '@angular/core';
import {
  CalendarWeek,
  MAX_WEEK_DAYS,
  WeekDays,
  WeekDaysNumbers,
} from './models';

@Component({
  selector: 'app-calendar-overview',
  templateUrl: './calendar-overview.component.html',
  styleUrls: ['./calendar-overview.component.scss'],
})
export class CalendarOverviewComponent implements OnInit {
  month: string = 'month';
  year: number = 2023;
  daysOfWeek = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  cells = [
    {
      title: 'Event 1',
      subtitle: '10:00am - 11:00am',
      content: 'Description of event 1',
    },
    {
      title: 'Event 2',
      subtitle: '2:00pm - 3:00pm',
      content: 'Description of event 2',
    },
    {
      title: 'Event 3',
      subtitle: '4:00pm - 5:00pm',
      content: 'Description of event 3',
    },
  ];

  today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  today2 = new Date().toISOString();

  today3 = new Date(this.today2);

  currentWeek: CalendarWeek = {} as CalendarWeek;

  constructor() {}

  ngOnInit(): void {
    this.calculateCurrentWeekDays();
    console.log(this.currentWeek);
  }

  // getCellContent(day: string, hour: string): string {
  //   const cell = this.cells.find((c) => c.day === day && c.hour === hour);
  //   return cell ? `${cell.title} - ${cell.content}` : '';
  // }

  calculateCurrentWeekDays() {
    const currentDayOfWeek: WeekDays = this.today3.getUTCDay();
    const startDate = this.today3;
    startDate.setDate(startDate.getDate() - currentDayOfWeek);

    const days: Date[] = Array.from({ length: MAX_WEEK_DAYS }, (_, day) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);

      return currentDate;
    });

    this.currentWeek = days.reduce(
      (accWeek: CalendarWeek, currentWekDay: Date, dayOfWeek: any) => {
        return {
          ...accWeek,
          [dayOfWeek]: {
            date: currentWekDay,
            dayOfWeekName: currentWekDay.toLocaleString('en-US', {
              weekday: 'short',
            }),
            monthDay: currentWekDay.getUTCDate(),
          },
        };
      },
      {} as CalendarWeek
    );
  }

  getWeekName(day: number) {
    return this.currentWeek[day as keyof CalendarWeek].dayOfWeekName;
  }

  getMonthDay(day: number) {
    return this.currentWeek[day as keyof CalendarWeek].monthDay;
  }
}
