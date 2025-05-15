import { Hono } from "hono";
import { z } from "zod";
import { User } from "@wedding-wish/core/user";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

/**
 * Create a user
 */
app.post(
    "/",
    zValidator(
    "json",
    z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
    }),
    ),
    async (c) => {
        console.log('create user');
        const validated = c.req.valid("json");
        const existingUser = await User.get(validated.email);

        if (existingUser) {
            return c.json({ error: "User already exists" }, 400);
        }

        const user = await User.create(validated);
        return c.json(user);
    },
);


/**
 * List all users
 */
// app.get("/", async (c) => {
//     const users = await User.list();
//     return c.json(users);
// });

/**
 * Update a user
 */
app.put(
    "/:email",
    zValidator(
        "json",
        z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
        }),
    ),
    async (c) => {
        const email = c.req.param("email");
        const validated = c.req.valid("json");
        
        try {
            await User.update(email, validated);
            const updatedUser = await User.get(email);
            return c.json(updatedUser);
        } catch (error) {
            return c.json({ error: "Failed to update user" }, 500);
        }
    },
);

export default app;