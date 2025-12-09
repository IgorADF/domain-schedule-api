// import { describe, it } from "vitest";
// import { AgendaConfig } from "../entities/agenda-config.js";
// import { GetDayAvailableSlots } from "./get-day-available-slots.js";
// import { YearDay } from "../entities/value-objects/day.js";
// import { HourTime } from "../entities/value-objects/hour-time.js";
// import { SlotRules } from "../entities/slot-rules.js";

// describe("GetDayAvailableSlots", () => {
//   it("", async () => {
//     const sup = new GetDayAvailableSlots();

//     await sup.execute({
//       agendaConfig: new AgendaConfig({
//         sellerId: "seller-123",
//         minutesOfInterval: 30,
//         maxDaysOfAdvancedNotice: 60,
//       }),
//       daySlotsRules: new SlotRules({
//         agendaId: "agenda-123",
//         dayOfWeek: 1,
//         minutesOfDuration: 60,
//         firstStartTime: new HourTime(8, 0),
//         firstEndTime: new HourTime(12, 0),
//         hasSecondPeriod: true,
//         secondStartTime: new HourTime(13, 0),
//         secondEndTime: new HourTime(17, 0),
//       }),
//       overwrite: undefined,
//       schedules: [],
//       newSchedule: {
//         day: new YearDay(2024, 12, 25, 14, 0),
//         startTime: new HourTime(14, 0),
//         endTime: new HourTime(15, 0),
//       },
//     });
//   });
// });
