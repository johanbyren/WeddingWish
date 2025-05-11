import { Hono } from "hono";
import { cors } from "hono/cors";
import { type LambdaContext, type LambdaEvent, handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";
import { createClient } from "@openauthjs/openauth/client";
import { subjects } from "@wedding-wish/core/subjects";

import userRoute from "./api/user";
import weddingRoute from "./api/wedding";
import photoRoute from "./api/photo";
import showWeddingRoute from "./api/show-wedding";
import showPhotoRoute from "./api/show-photo";
import settingsRoute from "./api/settings";
import giftRegistryRoute from "./api/gift-registry";

const client = createClient({
    clientID: "jwt-api",
    issuer: Resource.AuthApi.url,
});

const app = new Hono()
  .use(
    cors({
      origin:
        Resource.App.stage === "dev"
          ? "http://localhost:5173, *"
          : "https://wedding-wish.com", // TODO: change to wedding-wish.com or domain name
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(logger());

// Create a protected route group
const protectedApp = new Hono()
  .use(async (c, next) => {
    const auth = bearerAuth({
      verifyToken: async (token, c) => {
        const verified = await client.verify(subjects, token);
        if (verified.err) {
          return false;
        }
        c.set("email", verified.subject.properties.email);
        return true;
      },
    });
    return await auth(c, next);
  });

// Public routes
const routes = app
  .route("/api/user", userRoute)
  .route("/api/show-photo", showPhotoRoute)
  .route("/api/show-wedding", showWeddingRoute)

// Protected routes
const protectedRoutes = protectedApp
  .route("/api/wedding", weddingRoute)
  .route("/api/photo", photoRoute)
  .route("/api/settings", settingsRoute)
  .route("/api/gift-registry", giftRegistryRoute)

// Mount protected routes under the main app
app.route("/", protectedRoutes);

export type AppType = typeof routes;

export const handler = handle(app);