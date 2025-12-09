import {
  InvalidHourValue,
  InvalidMinutesValue,
} from "../errors/value-objects/hour-time.js";

export class HourTime {
  hour: number;
  minutes: number;
  constructor(hour: number, minutes: number) {
    this.hour = hour;
    this.minutes = minutes;

    if (hour < 0 || hour > 23) {
      throw new InvalidHourValue();
    }

    if (minutes < 0 || minutes > 59) {
      throw new InvalidMinutesValue();
    }
  }

  // static isStartBeforeEnd(startTime: HourTime, endTime: HourTime): boolean {
  //   if (startTime.hour > endTime.hour) {
  //     return false;
  //   }

  //   if (
  //     startTime.hour === endTime.hour &&
  //     startTime.minutes >= endTime.minutes
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }
}
