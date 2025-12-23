import z from "zod";
import { authSellerFactory } from "../../../core/use-cases/factories/auth-seller.js";
import { createSellerFactory } from "../../../core/use-cases/factories/create-seller.js";
import { updateSellerFactory } from "../../../core/use-cases/factories/update-seller.js";
import { AuthSellerSchema } from "../../../domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "../../../domain/use-cases/create-seller.js";
import { UpdateSellerSchema } from "../../../domain/use-cases/update-seller.js";
import type { FastifyZodInstance } from "../@types/fastity-instance.js";
import type { FastityInitRoutes } from "../@types/init-routes.js";

export function initSellerRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/auth",
      { schema: { body: AuthSellerSchema } },
      async (request, reply) => {
        const { useCase } = authSellerFactory();
        const result = await useCase.execute(request.body);
        return { id: result.seller_id };
      }
    );

    fastify.post(
      "/",
      { schema: { body: CreateSellerSchema } },
      async (request, reply) => {
        const { useCase } = createSellerFactory();
        const result = await useCase.execute(request.body);
        return { data: result.data };
      }
    );

    fastify.patch(
      "/:id",
      {
        schema: {
          params: z.object({ id: z.uuid() }),
          body: UpdateSellerSchema.omit({ id: true }),
        },
      },
      async (request, reply) => {
        const { id } = request.params;
        const { useCase } = updateSellerFactory();
        const result = await useCase.execute({ id, ...request.body });
        return { data: result.data };
      }
    );
  };
}
