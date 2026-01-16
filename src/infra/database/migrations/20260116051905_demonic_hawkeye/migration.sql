CREATE TYPE "enumAgendaEventsType" AS ENUM('new_schedule', 'cancel_by_client', 'cancel_by_user', 'reschedule_by_user');--> statement-breakpoint
CREATE TABLE "AgendaConfigs" (
	"id" uuid PRIMARY KEY,
	"sellerId" uuid NOT NULL UNIQUE,
	"maxDaysOfAdvancedNotice" integer NOT NULL,
	"minHoursOfAdvancedNotice" integer,
	"timezone" varchar(50) NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgendaDayOfWeek" (
	"id" uuid PRIMARY KEY,
	"agendaConfigId" uuid NOT NULL,
	"dayOfWeek" integer NOT NULL,
	"cancelAllDay" boolean NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgendaEvents" (
	"id" uuid PRIMARY KEY,
	"agendaConfigId" uuid NOT NULL,
	"type" "enumAgendaEventsType" NOT NULL,
	"description" varchar(500) NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgendaPeriods" (
	"id" uuid PRIMARY KEY,
	"agendaDayOfWeekId" uuid,
	"overwriteDayId" uuid,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"minutesOfService" integer NOT NULL,
	"minutesOfInterval" integer,
	"order" integer NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgendaSchedules" (
	"id" uuid PRIMARY KEY,
	"agendaConfigId" uuid NOT NULL,
	"contactName" varchar(100) NOT NULL,
	"contactPhoneNumber" varchar(20) NOT NULL,
	"day" date NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OverwriteDay" (
	"id" uuid PRIMARY KEY,
	"agendaConfigId" uuid NOT NULL,
	"day" date NOT NULL,
	"cancelAllDay" boolean NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sellers" (
	"id" uuid PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL UNIQUE,
	"password" varchar(100) NOT NULL,
	"creationDate" timestamp NOT NULL,
	"updateDate" timestamp NOT NULL,
	"deleteDate" timestamp
);
--> statement-breakpoint
ALTER TABLE "AgendaConfigs" ADD CONSTRAINT "AgendaConfigs_sellerId_Sellers_id_fkey" FOREIGN KEY ("sellerId") REFERENCES "Sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "AgendaDayOfWeek" ADD CONSTRAINT "AgendaDayOfWeek_agendaConfigId_AgendaConfigs_id_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "AgendaEvents" ADD CONSTRAINT "AgendaEvents_agendaConfigId_AgendaConfigs_id_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "AgendaPeriods" ADD CONSTRAINT "AgendaPeriods_agendaDayOfWeekId_AgendaDayOfWeek_id_fkey" FOREIGN KEY ("agendaDayOfWeekId") REFERENCES "AgendaDayOfWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "AgendaPeriods" ADD CONSTRAINT "AgendaPeriods_overwriteDayId_OverwriteDay_id_fkey" FOREIGN KEY ("overwriteDayId") REFERENCES "OverwriteDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "AgendaSchedules" ADD CONSTRAINT "AgendaSchedules_agendaConfigId_AgendaConfigs_id_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "OverwriteDay" ADD CONSTRAINT "OverwriteDay_agendaConfigId_AgendaConfigs_id_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;