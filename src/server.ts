import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
    return { status: "ok" };
});

type CreateUserBody = {
    name: string;
};

app.get("/users", async () => {
    return [{ id: 1, name: "Alice" }];
});

app.post<{ Body: CreateUserBody }>("/users", async (request, reply) => {
    const { name } = request.body;

    if (!name || name.trim().length === 0) {
        return reply.code(400).send({ error: "name is required" });
    }

    return reply.code(201).send({ id: 2, name });
});

const start = async () => {
    try {
        await app.listen({ port: 3000, host: "0.0.0.0" });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
