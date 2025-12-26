import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";
import { EntityAlreadyExist } from "@domain/use-cases/errors/entity-already-exist.js";
import { EntityNotFound } from "@domain/use-cases/errors/entity-not-found.js";
import { InvalidCreantionData } from "@domain/use-cases/errors/invalid-creation-data.js";
import { InvalidCredentials } from "@domain/use-cases/errors/invalid-credentials.js";

/**
 * Global error handler for Fastify API
 * Converts domain errors to appropriate HTTP responses
 */
export async function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	// Log error for debugging
	request.log.error(error);

	// Handle Zod validation errors
	if (error instanceof ZodError) {
		const propErrors = Object.entries(z.treeifyError(error)!.properties);
		const details = propErrors.map(([proName, errorsData]) => ({
			message: errorsData.errors[0],
			proName,
		}));

		return reply.status(400).send({
			error: "Validation Error",
			message: "Invalid request data",
			details,
		});
	}

	// Handle domain business logic errors
	if (error instanceof EntityNotFound) {
		return reply.status(404).send({
			error: "Not Found",
			message: error.message,
		});
	}

	if (error instanceof EntityAlreadyExist) {
		return reply.status(409).send({
			error: "Conflict",
			message: error.message,
		});
	}

	if (error instanceof InvalidCredentials) {
		return reply.status(401).send({
			error: "Unauthorized",
			message: error.message,
		});
	}

	if (error instanceof InvalidCreantionData) {
		return reply.status(400).send({
			error: "Bad Request",
			message: error.message,
		});
	}

	// Handle Fastify validation errors (from fastify-type-provider-zod)
	if (error.validation) {
		return reply.status(400).send({
			error: "Validation Error",
			message: error.message,
			details: error.validation,
		});
	}

	// Handle generic HTTP errors
	if (error.statusCode) {
		return reply.status(error.statusCode).send({
			error: error.name,
			message: error.message,
		});
	}

	// Handle unknown errors
	return reply.status(500).send({
		error: "Internal Server Error",
		message:
			process.env.NODE_ENV === "production"
				? "An unexpected error occurred"
				: error.message,
	});
}
