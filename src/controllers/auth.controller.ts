import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        // Implement login logic here
        console.log("Login request received:", request.body);
        // after validating user + password...
        const token = request.server.jwt.sign({ requestBody: request.body });
        return reply.send({ message: "Login successful", requestBody: request.body, token });
    }
}