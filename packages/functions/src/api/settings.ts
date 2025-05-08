import { Hono } from "hono";
import { z } from "zod";
import { settingsSchema, Settings } from "@wedding-wish/core/settings";
import { zValidator } from "@hono/zod-validator";

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

export default app;