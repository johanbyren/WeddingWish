import { Hono } from "hono";
import { cors } from "hono/cors";
import { type LambdaContext, type LambdaEvent, handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";
import { createClient } from "@openauthjs/openauth/client";
import { subjects } from "@wedding-wish/core/subjects";

import userRoute from "./api/user";

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
  .use(logger())
//   .use(async (c, next) => {
//     console.log('We are here: ', c);
//     const auth = bearerAuth({
//       verifyToken: async (token, c) => {
//         const verified = await client.verify(subjects, token);
//         if (verified.err) {
//           console.log('verified.err: ', verified.err);
//           return false;
//         }

//         c.set("email", verified.subject.properties.email);
//         console.log('c.get("email"): ', c.get("email"));
//         return true;
//       },
//     });
//     return await auth(c, next);
//   });

const routes = app
    .route("/api/user", userRoute);
  // .route("/api/camp", campRoute)
  // .route("/api/ledger", ledgerRoute)
  // .route("/api/member", memberRoute)
  // .route("/api/membership", membershipRoute)
  // .route("/api/report", reportRoute)
  // .route("/api/notification", notificationRoute);

export type AppType = typeof routes;

export const handler = handle(app);