-- CreateEnum
CREATE TYPE "EnumAgendaEventsType" AS ENUM ('new_schedule', 'cancel_by_client', 'cancel_by_user', 'reschedule_by_user');

-- CreateTable
CREATE TABLE "Sellers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,
    "deleteDate" TIMESTAMP,

    CONSTRAINT "Sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaConfigs" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "maxDaysOfAdvancedNotice" INTEGER NOT NULL,
    "minHoursOfAdvancedNotice" INTEGER,
    "timezone" VARCHAR(50) NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "AgendaConfigs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaEvents" (
    "id" UUID NOT NULL,
    "agendaConfigId" UUID NOT NULL,
    "type" "EnumAgendaEventsType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "AgendaEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaDayOfWeek" (
    "id" UUID NOT NULL,
    "agendaConfigId" UUID NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "cancelAllDay" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "AgendaDayOfWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverwriteDay" (
    "id" UUID NOT NULL,
    "agendaConfigId" UUID NOT NULL,
    "day" TEXT NOT NULL,
    "cancelAllDay" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "OverwriteDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaPeriods" (
    "id" UUID NOT NULL,
    "agendaDayOfWeekId" UUID,
    "overwriteDayId" UUID,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "minutesOfService" INTEGER NOT NULL,
    "minutesOfInterval" INTEGER,
    "order" INTEGER NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "AgendaPeriods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaSchedules" (
    "id" UUID NOT NULL,
    "agendaConfigId" UUID NOT NULL,
    "contactName" VARCHAR(100) NOT NULL,
    "contactPhoneNumber" VARCHAR(20) NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "updateDate" TIMESTAMP NOT NULL,

    CONSTRAINT "AgendaSchedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sellers_email_key" ON "Sellers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AgendaConfigs_sellerId_key" ON "AgendaConfigs"("sellerId");

-- AddForeignKey
ALTER TABLE "AgendaConfigs" ADD CONSTRAINT "AgendaConfigs_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaEvents" ADD CONSTRAINT "AgendaEvents_agendaConfigId_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaDayOfWeek" ADD CONSTRAINT "AgendaDayOfWeek_agendaConfigId_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverwriteDay" ADD CONSTRAINT "OverwriteDay_agendaConfigId_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaPeriods" ADD CONSTRAINT "AgendaPeriods_agendaDayOfWeekId_fkey" FOREIGN KEY ("agendaDayOfWeekId") REFERENCES "AgendaDayOfWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaPeriods" ADD CONSTRAINT "AgendaPeriods_overwriteDayId_fkey" FOREIGN KEY ("overwriteDayId") REFERENCES "OverwriteDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSchedules" ADD CONSTRAINT "AgendaSchedules_agendaConfigId_fkey" FOREIGN KEY ("agendaConfigId") REFERENCES "AgendaConfigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
