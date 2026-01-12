import { EntityAlreadyExist } from "@/domain/shared/errors/entity-already-exist.js";
import { EntityNotFound } from "@/domain/shared/errors/entity-not-found.js";
import { InvalidCreantionData } from "@/domain/shared/errors/invalid-creation-data.js";
import { InvalidCredentials } from "@/domain/shared/errors/invalid-credentials.js";
import { ScheduleTooFarAhead } from "@/domain/shared/errors/schedule-too-far-ahead.js";
import { ScheduleTooSoon } from "@/domain/shared/errors/schedule-too-soon.js";
import { SendEmailError } from "@/domain/shared/errors/send-email.js";
import { SlotNotAvailable } from "@/domain/shared/errors/slot-not-available.js";

export const USE_CASES_STATUS_CODE_MAP: Record<string, number> = {
	// 400 - Bad Request → validation, business rules, default
	[InvalidCreantionData.uniqueCode]: 400,
	[ScheduleTooSoon.uniqueCode]: 400,
	[ScheduleTooFarAhead.uniqueCode]: 400,
	[SendEmailError.uniqueCode]: 400,

	// 401 - Authentication failures
	[InvalidCredentials.uniqueCode]: 401,

	// 403 - Permission denied (if checking resource ownership)

	// 404 - Resource doesn't exist
	[EntityNotFound.uniqueCode]: 404,

	// 409 - Conflict with current state
	[EntityAlreadyExist.uniqueCode]: 409,
	[SlotNotAvailable.uniqueCode]: 409,
};
