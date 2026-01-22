import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { CreateUserBody } from "../models/requests/CreateUserBody";


export async function mainRoutes(app: FastifyInstance) {
    app.get("/health", async () => { return { status: "ok" }; });
}

export async function authRoutes(app: FastifyInstance) {
    app.post<{ Body: CreateUserBody }>("/login", async (request, reply) => {
        const authController = new AuthController();
        return authController.login(request, reply);
    });
    app.get("/users", { preHandler: [app.authenticate] }, async () => {
        return [{ id: 1, name: "Alice" }];
    });

    app.post<{ Body: CreateUserBody }>("/users", async (request, reply) => {
        const { name } = request.body;
        if (!name || name.trim().length === 0) {
            return reply.code(400).send({ error: "name is required" });
        }
        return reply.code(201).send({ id: 2, name });
    });
}