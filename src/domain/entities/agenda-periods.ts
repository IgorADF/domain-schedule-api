import { DefaultEntity } from "./_default.js";
import { InvalidMinIntervalValue } from "./errors/agenda-periods.js";
import { HourTime } from "./value-objects/hour-time.js";

export interface AgendaPeriodProps {
  agendaDayOfWeekId: string;
  overwriteId?: string;
  startTime: HourTime;
  endTime: HourTime;
  minutesOfInterval: number;
  order: number;
}

export class AgendaPeriod extends DefaultEntity<AgendaPeriodProps> {
  set minutesOfInterval(value: number) {
    if (value && value < 5) {
      throw new InvalidMinIntervalValue();
    }

    this.props.minutesOfInterval = value;
  }

  static create(props: AgendaPeriodProps, id?: string): AgendaPeriod {
    return new AgendaPeriod(props, id);
  }
}
