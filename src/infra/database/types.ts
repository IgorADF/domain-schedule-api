import type * as schema from "./schema.js";

export type SelectSellerWithPassword = typeof schema.sellers.$inferSelect;
export type SelectSeller = Omit<SelectSellerWithPassword, "password">;
export type InsertSeller = typeof schema.sellers.$inferInsert;

export type SelectAgendaConfigs = typeof schema.agendaConfigs.$inferSelect;
export type InsertAgendaConfigs = typeof schema.agendaConfigs.$inferInsert;

export type SelectAgendaDayOfWeek = typeof schema.agendaDayOfWeek.$inferSelect;
export type InsertAgendaDayOfWeek = typeof schema.agendaDayOfWeek.$inferInsert;

export type SelectAgendaPeriods = typeof schema.agendaPeriods.$inferSelect;
export type InsertAgendaPeriods = typeof schema.agendaPeriods.$inferInsert;

export type SelectAgendaEvent = typeof schema.agendaEvents.$inferSelect;
export type InsertAgendaEvent = typeof schema.agendaEvents.$inferInsert;

export type SelectAgendaSchedule = typeof schema.agendaSchedules.$inferSelect;
export type InsertAgendaSchedule = typeof schema.agendaSchedules.$inferInsert;

export type SelectOverwriteDay = typeof schema.overwriteDay.$inferSelect;
export type InsertOverwriteDay = typeof schema.overwriteDay.$inferInsert;
