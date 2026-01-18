/*
  Warnings:

  - Changed the type of `startTime` on the `AgendaPeriods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `AgendaPeriods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `AgendaSchedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `AgendaSchedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AgendaPeriods" DROP COLUMN "startTime",
ADD COLUMN     "startTime" VARCHAR(5) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" VARCHAR(5) NOT NULL;

-- AlterTable
ALTER TABLE "AgendaSchedules" DROP COLUMN "startTime",
ADD COLUMN     "startTime" VARCHAR(5) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" VARCHAR(5) NOT NULL;
