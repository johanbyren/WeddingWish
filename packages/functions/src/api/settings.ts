import { Hono } from "hono";
import { z } from "zod";
import { settingsSchema, Settings } from "@wedding-wish/core/settings";
import { zValidator } from "@hono/zod-validator";
import Stripe from "stripe";
import { Resource } from "sst";

const stripe = new Stripe(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: "2025-04-30.basil",
});

const app = new Hono();

app.get(
    "/:userId/:email",
    zValidator(
        "param",
        z.object({
            userId: z.string(),
        }),
    ),
    async (c) => {
        try {
            const userId = c.req.param("userId");
            const userEmail = c.req.param("email");
            const settings = await Settings.get(userId, userEmail);
            return c.json({ success: true, settings });
        } catch (error) {
            console.error("Error fetching settings:", error);
            return c.json({ error: "Failed to fetch settings" }, 500);
        }
    }
);

app.post("/", 
    zValidator(
        "json",
        z.object({
            userId: z.string(),
            email: z.string().email(),
            accountSettings: settingsSchema.shape.accountSettings.optional(),
            pageSettings: settingsSchema.shape.pageSettings.optional(),
            paymentSettings: settingsSchema.shape.paymentSettings.optional(),
            notificationSettings: settingsSchema.shape.notificationSettings.optional(),
            privacySettings: settingsSchema.shape.privacySettings.optional(),
        }),
    ),
    async (c) => {
        try {
            const body = await c.req.json();
            // Only include fields that are present in the request
            const settings = {
                userId: body.userId,
                email: body.email,
                ...(body.accountSettings && { accountSettings: body.accountSettings }),
                ...(body.pageSettings && { pageSettings: body.pageSettings }),
                ...(body.paymentSettings && { paymentSettings: body.paymentSettings }),
                ...(body.notificationSettings && { notificationSettings: body.notificationSettings }),
                ...(body.privacySettings && { privacySettings: body.privacySettings }),
            };
            const result = await Settings.save(settings);
            return c.json({ success: true, result });
        } catch (error) {
            console.error("Error updating settings:", error);
            return c.json({ error: "Failed to update settings" }, 500);
        }
    }
);

app.post("/stripe-connect", 
    zValidator(
        "json",
        z.object({
            userId: z.string(),
            email: z.string().email(),
        }),
    ),
    async (c) => {
        try {
            const { userId, email } = await c.req.json();
            
            // Get existing settings
            const settings = await Settings.get(userId, email);
            let accountId = settings?.paymentSettings?.stripeAccountId;
            
            // If no account exists, create one
            if (!accountId) {
                const account = await stripe.accounts.create({
                    type: 'express',
                    email: email,
                    capabilities: {
                        card_payments: { requested: true },
                        transfers: { requested: true },
                    },
                    business_type: 'individual',
                });
                
                accountId = account.id;

                // Save the account ID in settings
                await Settings.save({
                    userId,
                    email,
                    paymentSettings: {
                        paymentMethod: "stripe",
                        accountEmail: email,
                        notifyOnContribution: true,
                        autoThankYou: true,
                        stripeAccountId: accountId,
                    }
                });
            }

            // Create an account link for onboarding
            const accountLink = await stripe.accountLinks.create({
                account: accountId,
                refresh_url: `${Resource.App.stage === "dev" ? "http://localhost:5173" : "https://wedding-wish.com"}/dashboard/settings?tab=payment`,
                return_url: `${Resource.App.stage === "dev" ? "http://localhost:5173" : "https://wedding-wish.com"}/dashboard/settings?tab=payment`,
                type: "account_onboarding",
            });

            return c.json({ 
                success: true, 
                url: accountLink.url,
                accountId
            });
        } catch (error) {
            console.error("Error creating Stripe Connect account:", error);
            return c.json({ error: "Failed to create Stripe Connect account" }, 500);
        }
    }
);

export default app;