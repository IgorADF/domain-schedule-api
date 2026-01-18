import type {
	PrismaClient as _PrismaClient,
	Prisma,
} from "./_generated/client.js";
import type { TransactionClient } from "./_generated/internal/prismaNamespace.js";

export type MyPrismaClient = _PrismaClient;
export type PrismaTransaction = TransactionClient;

export type SellerWithPasswordPrisma = Prisma.SellerGetPayload<object>;
export type SellerPrisma = Omit<SellerWithPasswordPrisma, "password">;
export type CreateSellerPrisma = Prisma.SellerCreateInput;

export type AgendaConfigsPrisma = Prisma.AgendaConfigGetPayload<object>;
export type CreateAgendaConfigsPrisma = Prisma.AgendaConfigCreateManyInput;

export type AgendaDayOfWeekPrisma = Prisma.AgendaDayOfWeekGetPayload<object>;
export type CreateAgendaDayOfWeekPrisma = Prisma.AgendaDayOfWeekCreateManyInput;

export type AgendaPeriodsPrisma = Prisma.AgendaPeriodGetPayload<object>;
export type CreateAgendaPeriodsPrisma = Prisma.AgendaPeriodCreateManyInput;

export type AgendaEventPrisma = Prisma.AgendaEventGetPayload<object>;
export type CreateAgendaEventPrisma = Prisma.AgendaEventCreateManyInput;

export type AgendaSchedulePrisma = Prisma.AgendaScheduleGetPayload<object>;
export type CreateAgendaSchedulePrisma = Prisma.AgendaScheduleCreateManyInput;

export type OverwriteDayPrisma = Prisma.OverwriteDayGetPayload<object>;
export type CreateOverwriteDayPrisma = Prisma.OverwriteDayCreateManyInput;
