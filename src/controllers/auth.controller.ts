import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { UserModel } from "../models/db/auth/user.model";

import { FirebaseAuth, ListQuery } from "../models/requests/CreateUserBody";

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        // Implement login logic here
        console.log("Login request received:", request.body);
        // after validating user + password...
        //here I want to create the user and save the data in the mongoose
        if (!(request.body as any).name || !(request.body as any).email || !(request.body as any).password) {
            return reply.code(400).send({ error: "name, email and password are required" });
        }
        if (!await UserModel.findOne({ email: (request.body as any).email })) {
            return reply.code(400).send({ error: "User doesnt  exists" });
        }

        if (await UserModel.findOne({ email: (request.body as any).email, password: (request.body as any).password })) {
            // User authenticated

            const token = request.server.jwt.sign({ requestBody: request.body });
            return reply.send({ message: "Login successful", requestBody: request.body, token });
        } else {
            return reply.code(400).send({ error: "Invalid credentials" });
        }

    }

    async register(request: FastifyRequest, reply: FastifyReply) {
        // Implement registration logic here
        console.log("Register request received:", request.body);

        if (!(request.body as any).name || !(request.body as any).email || !(request.body as any).password) {
            return reply.code(400).send({ error: "name, email and password are required" });
        }
        if (await UserModel.findOne({ email: (request.body as any).email })) {
            return reply.code(400).send({ error: "User already exists" });
        }
        const user = new UserModel({
            name: (request.body as any).name,
            email: (request.body as any).email,
            password: (request.body as any).password, // In real scenario, hash the password
        });
        await user.save();
        return reply.code(201).send({ message: "User registered successfully", user });
    }

    async listUsers(request: FastifyRequest<{ Querystring: ListQuery }>, reply: FastifyReply) {
        const page = Math.max(1, Number(request.query.page ?? 1));
        const limit = Math.min(100, Math.max(1, Number(request.query.limit ?? 20)));
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            UserModel.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments()
        ]);

        return reply.send({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            users
        });
    }
    async firebaseAuth(
        request: FastifyRequest<{ Body: FirebaseAuth }>,
        reply: FastifyReply
    ) {
        const { idToken } = request.body;

        if (!idToken) {
            return reply.code(400).send({ error: "idToken is required" });
        }

        const app = request.server as FastifyInstance;

        let decoded;
        try {
            decoded = await app.firebase.auth().verifyIdToken(idToken);
        } catch (err) {
            request.log.warn({ err }, "Invalid Firebase token");
            return reply.code(401).send({ error: "Invalid or expired token" });
        }

        const firebaseUid = decoded.uid;
        const email = decoded.email ?? null;
        const name = decoded.name ?? decoded.displayName ?? null;

        // Prefer firebaseUid as the primary key
        // Make sure you have a unique index on firebaseUid in Mongo
        const user = await UserModel.findOneAndUpdate(
            { firebaseUid },
            {
                $setOnInsert: {
                    firebaseUid,
                    authProvider: "firebase",
                    createdAt: new Date(),
                },
                $set: {
                    // Keep profile info updated if it exists
                    ...(email ? { email } : {}),
                    ...(name ? { name } : {}),
                    lastLoginAt: new Date(),
                },
            },
            { upsert: true, new: true }
        );

        // Issue YOUR API token (keep JWT small)
        const apiToken = app.jwt.sign(
            {
                sub: user._id.toString(),
                firebaseUid: user.firebaseUid,
                email: user.email 
            },
            { expiresIn: "1h" } // example
        );

        return reply.send({
            token: apiToken,
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name 
            },
        });
    }

}