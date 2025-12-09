import { DefaultEntity } from "./_default.js";
import { YearDay } from "./value-objects/day.js";
import { HourTime } from "./value-objects/hour-time.js";

export interface ScheduleProps {
  sellerId: string;
  clientName: string;
  clientPhoneNumber: string;
  day: YearDay;
  startTime: HourTime;
  endTime: HourTime;
}

export class Schedule extends DefaultEntity<ScheduleProps> {
  create(props: ScheduleProps, id?: string): Schedule {
    return new Schedule(props, id);
  }
}
