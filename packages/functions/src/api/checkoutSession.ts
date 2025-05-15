import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import Stripe from "stripe";
import { Resource } from "sst";

const stripe = new Stripe(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: "2025-04-30.basil",
});

const app = new Hono();

/**
 * Create a checkout session
 */
app.post(
  "/",
  zValidator(
    "json",
    z.object({
      priceId: z.string(),
      quantity: z.number().default(1),
      returnUrl: z.string().url(),
    })
  ),
  async (c) => {
    try {
      const { priceId, quantity, returnUrl } = c.req.valid("json");
      
      console.log('Creating checkout session with:', { priceId, quantity, returnUrl });

      // Verify the price exists
      const price = await stripe.prices.retrieve(priceId);
      console.log('Retrieved price:', price);

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        mode: "payment",
        ui_mode: "embedded",
        return_url: returnUrl,
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'SE', 'NO', 'DK', 'FI'],
        },
      });

      console.log('Created session:', session);

      return c.json({ clientSecret: session.client_secret });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      if (error instanceof Error) {
        return c.json({ 
          error: error.message,
          type: error.name,
          details: error instanceof Stripe.errors.StripeError ? error.raw : undefined
        }, 400);
      }
      return c.json({ error: "Failed to create checkout session" }, 500);
    }
  }
);

export default app;
