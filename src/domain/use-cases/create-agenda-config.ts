import { AgendaConfig } from "../entities/agenda-config.js";
import { AgendaDayOfWeek } from "../entities/agenda-day-of-week.js";
import { AgendaPeriod, AgendaPeriodProps } from "../entities/agenda-periods.js";
import { HourTime } from "../entities/value-objects/hour-time.js";

type DayOfWeek = {
  dayInfo: AgendaDayOfWeek;
  periods: AgendaPeriod[];
};

interface CreateAgendaConfigProps {
  configData: AgendaConfig;
  daysConfig: DayOfWeek[];
}

export class CreateAgendaConfigUseCase {
  constructor() {}

  async execute({
    configData,
    daysConfig,
  }: CreateAgendaConfigProps): Promise<void> {
    daysConfig.forEach(({ periods }) => {
      this.validateDayPeriods(periods);
    });
  }

  validateDaysOfWeek(days: DayOfWeek[]) {
    const uniqueDaysOfWeek = new Set(
      days.map((day) => day.dayInfo.props.dayOfWeek)
    ).size;

    if (uniqueDaysOfWeek !== days.length || uniqueDaysOfWeek !== 7) {
      throw new Error("Days of the week must be unique");
    }

    days.forEach(({ periods }) => {
      this.validateDayPeriods(periods);
    });
  }

  validateDayPeriods(periods: AgendaPeriod[]): void {
    if (periods.length === 0) {
      throw new Error("At least one agenda period is required");
    }

    if (periods.length > 5) {
      throw new Error("Cannot have more than 5 agenda periods");
    }

    let lastOrder = 0;
    let nextStartHour: HourTime | null = null;

    periods.forEach(({ props: periodData }, index) => {
      if (periodData.order <= lastOrder) {
        throw new Error("Order must be sequential and start from 1");
      }

      if (nextStartHour !== null) {
        if (
          periodData.startTime.hour < nextStartHour.hour ||
          (periodData.startTime.hour === nextStartHour.hour &&
            periodData.startTime.minutes < nextStartHour.minutes)
        ) {
          throw new Error(
            "Periods must not overlap and should be in chronological order"
          );
        }
      }

      lastOrder = periodData.order;
      nextStartHour = periodData.endTime;
    });
  }
}
