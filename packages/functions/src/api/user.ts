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
app.get("/", async (c) => {
    const users = await User.list();
    return c.json(users);
});


export default app;