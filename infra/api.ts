import { weddingAssets, usersTable, weddingsTable, giftRegistryTable, contributionsTable, settingsTable, swishDonationsTable } from "./storage";
import { auth } from "./auth";
import { email } from "./email";
import { stripeSecretKey, stripePublishableKey, stripeAccountId } from "./secrets";
import { router as weddingAssetsRouter } from "./router";

export const api = new sst.aws.Function("Api", {
  url: true,
  handler: "packages/functions/src/api.handler",
  architecture: "arm64",
  link: [
    auth, 
    email, 
    weddingAssets, 
    usersTable, 
    weddingsTable, 
    giftRegistryTable, 
    contributionsTable, 
    settingsTable, 
    swishDonationsTable,
    stripeSecretKey, 
    stripePublishableKey,
    stripeAccountId,
    weddingAssetsRouter
  ],
  // environment: {
  //   WEB_URL:
  //     $app.stage === "dev" ? "https://wedding-wish" : "http://localhost:5173",
  // },
});
