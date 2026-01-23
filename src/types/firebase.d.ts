import "fastify";
import type admin from "firebase-admin";

declare module "fastify" {
  interface FastifyInstance {
    firebase: typeof admin;
  }
}
