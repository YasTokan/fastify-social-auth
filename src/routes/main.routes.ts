import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { CreateUserBody, FirebaseAuth, ListQuery } from "../models/requests/CreateUserBody";
import { request } from "https";


export async function mainRoutes(app: FastifyInstance) {
    app.get("/health", async () => { return { status: "ok" }; });
}

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController();

    app.post<{ Body: CreateUserBody }>("/login", async (request, reply) => {
        return authController.login(request, reply);
    });

    app.post<{ Body: CreateUserBody }>("/register", async (request, reply) => {
        return authController.register(request, reply);
    });


    app.post<{ Body: CreateUserBody }>("/users", async (request, reply) => {
        const { name } = request.body;
        if (!name || name.trim().length === 0) {
            return reply.code(400).send({ error: "name is required" });
        }
        return reply.code(201).send({ id: 2, name });
    });
    app.get<{ Querystring: ListQuery }>("/users", { preHandler: [app.authenticate] }, async (request, reply) => {
        return authController.listUsers(request, reply);
    });

    app.post<{ Body: FirebaseAuth }>("/firebaseAuth", async (request, reply) => {
        return authController.firebaseAuth(request, reply);
    });
}