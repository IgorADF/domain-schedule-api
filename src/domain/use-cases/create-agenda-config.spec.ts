import { describe, it } from "vitest";
import { HourTime } from "../entities/value-objects/hour-time.js";
import { AgendaConfig } from "../entities/agenda-config.js";
import { CreateAgendaConfigUseCase } from "./create-agenda-config.js";
import { AgendaDayOfWeek } from "../entities/agenda-day-of-week.js";
import { AgendaPeriod } from "../entities/agenda-periods.js";

describe("CreateAgendaConfig", () => {
  it("", async () => {
    const sup = new CreateAgendaConfigUseCase();
    await sup.execute({
      configData: AgendaConfig.create({
        maxDaysOfAdvancedNotice: 30,
        sellerId: "seller-123",
        timezone: "UTC",
      }),
      daysConfig: [
        {
          dayInfo: new AgendaDayOfWeek({
            agendaConfigId: "config-123",
            dayOfWeek: 1,
          }),
          periods: [
            new AgendaPeriod({
              agendaDayOfWeekId: "day-123",
              endTime: new HourTime(12, 0),
              startTime: new HourTime(8, 0),
              minutesOfInterval: 30,
              order: 1,
            }),
          ],
        },
      ],
    });
  });
});
