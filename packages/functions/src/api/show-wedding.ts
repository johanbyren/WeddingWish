import { Hono } from "hono";
import { z } from "zod";
import { Wedding } from "@wedding-wish/core/wedding";
import { Photo } from "@wedding-wish/core/photo";
import { Settings } from "@wedding-wish/core/settings";
import { zValidator } from "@hono/zod-validator";
import { Resource } from "sst";

const app = new Hono();

/**
 * Get a wedding by ID
 */
app.get(
    "/:slug",
    zValidator(
        "param",
        z.object({
            slug: z.string(),
        }),
    ),
    async (c) => {
        try {
            const { slug } = c.req.valid("param");
            const wedding = await Wedding.getById(slug);
            if (!wedding) {
                console.log("API: No wedding found for id:", slug);
                return c.json({ error: "Wedding not found" }, 404);
            }

            // Get signed URLs for all photos
            const photoUrls = await Promise.all(
                (wedding.photoUrls || []).map(async (key) => {
                    try {
                        const { url } = await Photo.getByFileName(key);
                        return url;
                    } catch (error) {
                        console.error("Error getting signed URL for photo:", error);
                        return key; // Return the original key if getting signed URL fails
                    }
                })
            );

            // Get user's payment and language settings
            let paymentSettings = null;
            let languageSettings = null;
            try {
                console.log("Fetching user settings for userId:", wedding.userId);
                const userSettings = await Settings.get(wedding.userId, wedding.userId);
                console.log("User settings fetched:", userSettings);
                paymentSettings = userSettings?.paymentSettings || null;
                languageSettings = userSettings?.languageSettings || null;
                console.log("Payment settings extracted:", paymentSettings);
                console.log("Language settings extracted:", languageSettings);
            } catch (error) {
                console.error("Error fetching user settings:", error);
                // Continue without settings if there's an error
            }

            // If wedding has a language setting, also save it to user settings
            if (wedding.language) {
                try {
                    await Settings.save({
                        userId: wedding.userId,
                        email: wedding.userId,
                        languageSettings: {
                            language: wedding.language
                        }
                    });
                } catch (error) {
                    console.error("Error saving language to user settings:", error);
                    // Continue without failing the wedding request
                }
            }

            return c.json({
                ...wedding,
                photoUrls,
                paymentSettings,
                languageSettings: wedding.language ? { language: wedding.language } : languageSettings
            });
        } catch (error) {
            console.error("API: Error fetching wedding by id:", error);
            return c.json({ error: "Failed to fetch wedding" }, 500);
        }
    },
);

/**
 * Get a wedding by custom URL
 */
app.get(
    "/custom-url/:customUrl",
    zValidator(
        "param",
        z.object({
            customUrl: z.string(),
        }),
    ),
    async (c) => {
        try {
            const { customUrl } = c.req.valid("param");
            const wedding = await Wedding.getByCustomUrl(customUrl);
            if (!wedding) {
                return c.json({ error: "Wedding not found" }, 404);
            }

            // Get signed URLs for all photos
            const photoUrls = await Promise.all(
                (wedding.photoUrls || []).map(async (key) => {
                    try {
                        const { url } = await Photo.getByFileName(key);
                        return url;
                    } catch (error) {
                        console.error("Error getting signed URL for photo:", error);
                        return key; // Return the original key if getting signed URL fails
                    }
                })
            );

            // Get user's payment and language settings
            let paymentSettings = null;
            let languageSettings = null;
            try {
                console.log("Fetching user settings for userId:", wedding.userId);
                const userSettings = await Settings.get(wedding.userId, wedding.userId);
                console.log("User settings fetched:", userSettings);
                paymentSettings = userSettings?.paymentSettings || null;
                languageSettings = userSettings?.languageSettings || null;
                console.log("Payment settings extracted:", paymentSettings);
                console.log("Language settings extracted:", languageSettings);
            } catch (error) {
                console.error("Error fetching user settings:", error);
                // Continue without settings if there's an error
            }

            // If wedding has a language setting, also save it to user settings
            if (wedding.language) {
                try {
                    await Settings.save({
                        userId: wedding.userId,
                        email: wedding.userId,
                        languageSettings: {
                            language: wedding.language
                        }
                    });
                } catch (error) {
                    console.error("Error saving language to user settings:", error);
                    // Continue without failing the wedding request
                }
            }

            return c.json({
                ...wedding,
                photoUrls,
                paymentSettings,
                languageSettings: wedding.language ? { language: wedding.language } : languageSettings
            });
        } catch (error) {
            console.error("Error fetching wedding:", error);
            return c.json({ error: "Failed to fetch wedding" }, 500);
        }
    },
);

export default app; 