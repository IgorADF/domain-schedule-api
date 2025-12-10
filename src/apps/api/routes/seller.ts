import {
  AuthSellerSchema,
  AuthSellerUseCase,
} from "../../../domain/use-cases/auth-seller.js";
import { SellerRepository } from "../../../core/repository/seller.repository.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";

export async function initSellerRoutes(fastify: FastifyZodInstance) {
  fastify.post(
    "/auth",
    { schema: { body: AuthSellerSchema } },
    async function handler(request, reply) {
      const rep = new SellerRepository();
      const sup = new AuthSellerUseCase(rep);

      const res = await sup.execute(request.body);

      return { id: res.seller_id };
    }
  );
}
