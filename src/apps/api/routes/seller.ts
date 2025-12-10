import { FastifyInstance } from "fastify";
import {
  AuthSellerSchema,
  AuthSellerUseCase,
} from "../../../domain/use-cases/auth-seller.js";
import { SellerRepository } from "../../../core/repository/seller.repository.js";

export async function initSellerRoutes(fastify: FastifyInstance) {
  fastify.post("/auth", async function handler(request, reply) {
    const rep = new SellerRepository();
    const sup = new AuthSellerUseCase(rep);

    const parsed = AuthSellerSchema.parse(request.body);

    const res = await sup.execute(parsed);

    return { id: res.seller_id };
  });
}
