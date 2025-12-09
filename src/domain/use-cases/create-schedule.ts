// import { HourTime } from "../entities/value-objects/hour-time.js";
// import { YearDay } from "../entities/value-objects/day.js";
// import { AgendaConfigsRepository } from "../repositories/agenda-configs.interface.js";
// import { DateTime } from "luxon";
// import { SlotRulesRepository } from "../repositories/slots-rules.interface.js";

// interface CreateScheduleProps {
//   sellerId: string;
//   contactName: string;
//   day: YearDay;
//   startTime: HourTime;
//   endTime: HourTime;
// }

// export class CreateSchedule {
//   constructor(
//     private agendaConfigRepository: AgendaConfigsRepository,
//     private slotRulesRepository: SlotRulesRepository
//   ) {}

//   async execute(props: CreateScheduleProps): Promise<void> {
//     const isScheduleFutureDate = props.day.isFutureDate();
//     if (!isScheduleFutureDate) {
//       throw new Error("Schedule date must be in the future.");
//     }

//     const isScheduleStartBeforeEnd = HourTime.isStartBeforeEnd(
//       props.startTime,
//       props.endTime
//     );
//     if (!isScheduleStartBeforeEnd) {
//       throw new Error("Start time must be before end time.");
//     }

//     const sellerAgendaConfig = await this.agendaConfigRepository.getBySellerId(
//       props.sellerId
//     );

//     this.validateMaxAdvancedNoticeDate(
//       props.day,
//       sellerAgendaConfig.props.maxDaysOfAdvancedNotice
//     );

//     if (sellerAgendaConfig.props.minHoursOfAdvancedNotice) {
//       this.validateMinAdvancedNoticeDate(
//         props.day,
//         sellerAgendaConfig.props.minHoursOfAdvancedNotice
//       );
//     }

//     const sellerAgendaSlots = await this.slotRulesRepository.getBySellerId(
//       props.sellerId
//     );
//   }

//   /* Think this should be encapsulated inside an entity */
//   validateMaxAdvancedNoticeDate(
//     scheduleDate: YearDay,
//     maxDaysOfAdvancedNotice: number
//   ) {
//     const maxAdvancedNoticeDate = DateTime.now()
//       .plus({
//         days: maxDaysOfAdvancedNotice,
//       })
//       .toJSDate();

//     if (scheduleDate.isFutureDate(maxAdvancedNoticeDate)) {
//       throw new Error(
//         "Schedule date exceeds the maximum advanced notice period."
//       );
//     }
//   }

//   /* Think this should be encapsulated inside an entity */
//   validateMinAdvancedNoticeDate(
//     scheduleDate: YearDay,
//     minDaysOfAdvancedNotice: number
//   ) {
//     const minAdvancedNoticeDate = DateTime.now()
//       .plus({
//         days: minDaysOfAdvancedNotice,
//       })
//       .toJSDate();

//     if (!scheduleDate.isFutureDate(minAdvancedNoticeDate)) {
//       throw new Error(
//         "Schedule date exceeds the maximum advanced notice period."
//       );
//     }
//   }
// }
