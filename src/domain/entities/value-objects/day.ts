export class YearDay {
  year: number;
  month: number;
  day: number;
  // startHour: number;
  // startMinute: number;

  constructor(
    year: number,
    month: number,
    day: number,
    startHour: number,
    startMinute: number
  ) {
    this.year = year;
    this.month = month;
    this.day = day;
    // this.startHour = startHour;
    // this.startMinute = startMinute;
  }

  private getDateValue(): Date {
    return new Date(
      Number(this.year),
      Number(this.month) - 1,
      Number(this.day)
      // Number(this.startHour),
      // Number(this.startMinute)
    );
  }
}
