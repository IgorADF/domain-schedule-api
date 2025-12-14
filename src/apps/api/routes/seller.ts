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

export function initSellerRoutes(uow: SequelizeUnitOfWork): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/auth",
      { schema: { body: AuthSellerSchema } },
      async function (request, reply) {
        const sup = new AuthSellerUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { id: useCase.seller_id };
      }
    );

    fastify.post(
      "/",
      { schema: { body: CreateSellerSchema } },
      async function (request, reply) {
        const sup = new CreateSellerUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { data: useCase.data };
      }
    );
  };
}
