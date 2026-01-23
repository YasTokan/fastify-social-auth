import fp from "fastify-plugin";
import admin from "firebase-admin";
import type { FastifyInstance } from "fastify";

export default fp(async (app: FastifyInstance) => {
  // Recommended: set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path
  // or provide credentials via env variables.
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }

  // Make firebase admin available everywhere via app.firebase
  app.decorate("firebase", admin);
});
