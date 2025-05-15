import { weddingAssets, usersTable, weddingsTable, giftRegistryTable, contributionsTable, settingsTable } from "./storage";
import { auth } from "./auth";
import { email } from "./email";
import { stripeSecretKey, stripePublishableKey } from "./secrets";

export const api = new sst.aws.Function("Api", {
  url: true,
  handler: "packages/functions/src/api.handler",
  architecture: "arm64",
  link: [auth, email, weddingAssets, usersTable, weddingsTable, giftRegistryTable, contributionsTable, settingsTable, stripeSecretKey, stripePublishableKey],
  // environment: {
  //   WEB_URL:
  //     $app.stage === "dev" ? "https://wedding-wish" : "http://localhost:5173",
  // },
});
