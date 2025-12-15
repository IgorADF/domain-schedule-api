import z from "zod";
import {
  AuthSellerSchema,
  AuthSellerUseCase,
} from "../../../domain/use-cases/auth-seller.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";
import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";
import { FastityInitRoutes } from "../@types/init-routes.js";
import {
  CreateSellerSchema,
  CreateSellerUseCase,
} from "../../../domain/use-cases/create-seller.js";
import {
  UpdateSellerSchema,
  UpdateSellerUseCase,
} from "../../../domain/use-cases/update-seller.js";

export function initSellerRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/auth",
      { schema: { body: AuthSellerSchema } },
      async function (request, reply) {
        const uow = new SequelizeUnitOfWork();
        const sup = new AuthSellerUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { id: useCase.seller_id };
      }
    );

    fastify.post(
      "/",
      { schema: { body: CreateSellerSchema } },
      async function (request, reply) {
        const uow = new SequelizeUnitOfWork();
        const sup = new CreateSellerUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { data: useCase.data };
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
      async function (request, reply) {
        const { id } = request.params;
        const uow = new SequelizeUnitOfWork();
        const sup = new UpdateSellerUseCase(uow);
        const useCase = await sup.execute({ id, ...request.body });
        return { data: useCase.data };
      }
    );
  };
}
