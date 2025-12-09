import { FastifyInstance } from "fastify";
import { SellerRepository } from "../../../domain/repositories/seller.interface.js";
import {
  AuthSellerSchema,
  AuthSellerUseCase,
} from "../../../domain/use-cases/auth-seller.js";

export async function initSellerRoutes(fastify: FastifyInstance) {
  fastify.post("/auth", async function handler(request, reply) {
    const rep: SellerRepository = {
      async createSeller(_) {
        return {
          id: "string",
          email: "string",
          password: "string",
        };
      },

      async getSeller(email) {
        return {
          id: "string",
          email: "string",
          password: "string",
        };
      },
    };

    const sup = new AuthSellerUseCase(rep);

    const parsed = AuthSellerSchema.parse(request.body);

    const res = await sup.execute(parsed);

    return { id: res.seller_id };
  });
}
