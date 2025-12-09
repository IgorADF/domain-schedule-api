// import { beforeAll, describe, it } from "vitest";
// import { CreateSchedule } from "./create-schedule.js";
// import { YearDay } from "../entities/value-objects/day.js";
// import { HourTime } from "../entities/value-objects/hour-time.js";
// import { AgendaConfig } from "../entities/agenda-config.js";

// const fakeAgendaConfigsRep = {
//   getBySellerId: async (sellerId: string) => {
//     return new AgendaConfig({
//       sellerId,
//       minutesOfInterval: 30,
//       maxDaysOfAdvancedNotice: 60,
//       minHoursOfAdvancedNotice: 2,
//     });
//   },
// };

// describe("CreateSchedule", () => {
//   it("should validate if schedule is a future date", async () => {
//     // const schedule = new CreateSchedule(fakeAgendaConfigsRep);
//     // await schedule.execute({
//     //   sellerId: "user-123",
//     //   contactName: "John Doe",
//     //   day: new YearDay(2024, 12, 25, 14, 0),
//     //   startTime: new HourTime(14, 0),
//     //   endTime: new HourTime(15, 0),
//     // });
//   });
// });
