import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";
import { DefaultUseCaseError } from "@/domain/shared/errors/_base-class.js";
import { EntityAlreadyExist } from "@/domain/shared/errors/entity-already-exist.js";
import { EntityNotFound } from "@/domain/shared/errors/entity-not-found.js";
import { InvalidCreantionData } from "@/domain/shared/errors/invalid-creation-data.js";
import { InvalidCredentials } from "@/domain/shared/errors/invalid-credentials.js";
import { ScheduleTooFarAhead } from "@/domain/shared/errors/schedule-too-far-ahead.js";
import { ScheduleTooSoon } from "@/domain/shared/errors/schedule-too-soon.js";
import { SendEmailError } from "@/domain/shared/errors/send-email.js";
import { SlotNotAvailable } from "@/domain/shared/errors/slot-not-available.js";
import { AuthHandlerError } from "../auth/_main.js";
import type { ErrorSchemaType } from "./schema.js";

const USE_CASES_STATUS_CODE_MAP: Record<string, number> = {
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

/**
 * Overwrite Fastify reply to ensure serialization even in error cases
 * Otherwise, Fastify Zod plugin may throw 500 errors if the body
 * does not match the expected response schema definition on the route.
 */
function setReplySerializationError(
	reply: FastifyReply,
	statusCode: number,
	body: ErrorSchemaType,
) {
	reply
		.status(statusCode)
		.headers({ "Content-Type": "application/json" })
		.serializer((payload) => JSON.stringify(payload))
		.send(body);
}

function handleAuthMiddleareError(
	error: FastifyError,
	reply: FastifyReply,
): boolean {
	if (!(error instanceof AuthHandlerError)) {
		return false;
	}

	setReplySerializationError(reply, error.replyStatusCode, {
		error: error.uniqueCode,
		message: error.message,
		details: null,
	});

	return false;
}

/**
 * Reply body must have the same props as DefaultErrorSchema
 * otherwise an 500 error will be thrown by Fastify Zod plugin.
 */
function handleUseCaseError(error: FastifyError, reply: FastifyReply): boolean {
	if (error instanceof DefaultUseCaseError) {
		const useCaseErrorStatusCode =
			USE_CASES_STATUS_CODE_MAP[error.uniqueCode] || 400;

		const returnUseCaseErrorObj = {
			error: error.uniqueCode,
			message: error.message,
			details: null,
		};

		// reply.status(useCaseErrorStatusCode).send(returnUseCaseErrorObj);

		setReplySerializationError(
			reply,
			useCaseErrorStatusCode,
			returnUseCaseErrorObj,
		);

		return true;
	}

	return false;
}

function handleZodRuntimeError(
	error: FastifyError,
	reply: FastifyReply,
): boolean {
	if (error instanceof ZodError) {
		const flattenedErrors = z.flattenError(error);

		const details = Object.entries(flattenedErrors.fieldErrors).map(
			([field, messages]) => ({
				field,
				message: (messages as string[])?.[0] || "Validation failed",
			}),
		);

		setReplySerializationError(reply, 400, {
			error: "Validation Error",
			message: "Invalid request data",
			details,
		});

		return true;
	}

	return false;
}

function handleFastifyZodProviderError(
	error: FastifyError,
	reply: FastifyReply,
): boolean {
	if (error?.validation) {
		const details = error.validation.map((err) => ({
			field: err?.instancePath?.replace(/^\//, "")?.replace(/\//g, "."),
			message: err?.message || "",
			// expected: err?.params?.expected,
		}));

		setReplySerializationError(reply, 400, {
			error: "Validation Error",
			message: `Invalid ${error?.validationContext || "input"}`,
			details,
		});

		return true;
	}

	return false;
}

export async function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		request.log.error(error);

		const hasAuthMiddlewareErrorHandled = handleAuthMiddleareError(
			error,
			reply,
		);
		if (hasAuthMiddlewareErrorHandled) {
			return reply;
		}

		const hasUseCaseErrorHandled = handleUseCaseError(error, reply);
		if (hasUseCaseErrorHandled) {
			return reply;
		}

		const hasZodRuntimeErrorHandled = handleZodRuntimeError(error, reply);
		if (hasZodRuntimeErrorHandled) {
			return reply;
		}

		const hasFastifyZodProviderErrorHandled = handleFastifyZodProviderError(
			error,
			reply,
		);
		if (hasFastifyZodProviderErrorHandled) {
			return reply;
		}

		if (error?.statusCode) {
			setReplySerializationError(reply, error.statusCode, {
				error: error?.name,
				message: error?.message,
				details: null,
			});
			return reply;
		}

		setReplySerializationError(reply, 500, {
			error: "Internal Server Error",
			message: "An unexpected error occurred",
			details: null,
		});

		return reply;
	} catch (error) {
		request.log.error(error);

		setReplySerializationError(reply, 500, {
			error: "Internal Server Error",
			message: "An unexpected error occurred",
			details: null,
		});

		return reply;
	}
}
