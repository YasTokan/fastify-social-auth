import { fastify, FastifyInstance } from "fastify";

import { authRoutes, mainRoutes } from "./routes/main.routes";
import { connectDB } from "./middleware/db.confing";
import dotenv from "dotenv";
import jwtPlugin from "./plugins/jwt.plugin";
import authPlugin from "./plugins/auth.plugin";

dotenv.config();
const buildServer = (): FastifyInstance => {
    const app = fastify({ logger: true });
    app.register(jwtPlugin);
    app.register(authPlugin);

    app.register(mainRoutes);
    app.register(authRoutes, { prefix: "/auth" });

    return app;
};

const start = async () => {
    await connectDB();
    const app = buildServer();

    try {
        await app.listen({ port: 3000, host: "0.0.0.0" });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
