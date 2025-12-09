// import { DateTime } from "luxon";
// import { AgendaConfig } from "../entities/agenda-config.js";
// import { OverwriteDay } from "../entities/overwrite-day.js";
// import { Schedule } from "../entities/schedule.js";
// import { SlotRules } from "../entities/slot-rules.js";
// import { YearDay } from "../entities/value-objects/day.js";
// import { HourTime } from "../entities/value-objects/hour-time.js";

// interface GetDayAvailableSlotsProps {
//   agendaConfig: AgendaConfig;
//   daySlotsRules: SlotRules;
//   overwrite?: { generalConfig: OverwriteDay; rules: SlotRules };
//   schedules: Schedule[];
//   // newSchedule: { day: YearDay; startTime: HourTime; endTime: HourTime };
// }

// export class GetDayAvailableSlots {
//   constructor() {}

//   async execute({
//     agendaConfig,
//     daySlotsRules,
//     overwrite,
//     schedules,
//   }: // newSchedule,
//   GetDayAvailableSlotsProps): Promise<
//     { startTime: HourTime; endTime: HourTime }[]
//   > {
//     if (overwrite) {
//       return this.getAllDaySlots(agendaConfig, overwrite.rules, schedules);
//     }

//     return this.getAllDaySlots(agendaConfig, daySlotsRules, schedules);
//   }

//   getAllDaySlots(
//     { props: agendaConfig }: AgendaConfig,
//     { props: slotRules }: SlotRules,
//     schedules: Schedule[]
//   ) {
//     let slots: { startTime: HourTime; endTime: HourTime }[] =
//       this.getPeriodSlots(
//         slotRules.firstStartTime,
//         slotRules.firstEndTime,
//         slotRules.minutesOfDuration,
//         schedules
//       );

//     if (
//       slotRules.hasSecondPeriod &&
//       slotRules.secondStartTime &&
//       slotRules.secondEndTime
//     ) {
//       slots = slots.concat(
//         this.getPeriodSlots(
//           slotRules.secondStartTime,
//           slotRules.secondEndTime,
//           slotRules.minutesOfDuration,
//           schedules
//         )
//       );
//     }

//     return slots;
//   }

//   getPeriodSlots(
//     firstStartTime: HourTime,
//     firstEndTime: HourTime,
//     minutesOfDuration: number,
//     schedules: Schedule[]
//   ) {
//     const slots: { startTime: HourTime; endTime: HourTime }[] = [];

//     let firstPeriodSlotStartTime = DateTime.now().startOf("day").set({
//       hour: firstStartTime.hour,
//       minute: firstStartTime.minutes,
//     });

//     const firstPeriodLimitTime = DateTime.now().startOf("day").set({
//       hour: firstEndTime.hour,
//       minute: firstEndTime.minutes,
//     });

//     while (firstPeriodSlotStartTime < firstPeriodLimitTime) {
//       const firstPeriodSlotEndTime = firstPeriodSlotStartTime.plus({
//         minutes: minutesOfDuration,
//       });

//       slots.push({
//         startTime: new HourTime(
//           firstPeriodSlotStartTime.hour,
//           firstPeriodSlotStartTime.minute
//         ),
//         endTime: new HourTime(
//           firstPeriodSlotEndTime.hour,
//           firstPeriodSlotEndTime.minute
//         ),
//       });

//       firstPeriodSlotStartTime = firstPeriodSlotEndTime;
//     }

//     return slots;
//   }
// }
