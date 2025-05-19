import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import Stripe from "stripe";
import { Resource } from "sst";
import { Settings } from "@wedding-wish/core/settings";

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
      giftId: z.string(),
      amount: z.number().positive(),
      returnUrl: z.string().url(),
      userId: z.string(), // Add userId to get the connected account
    })
  ),
  async (c) => {
    try {
      const { giftId, amount, returnUrl, userId } = c.req.valid("json");
      
      console.log('Creating checkout session with:', { giftId, amount, returnUrl, userId });

      // Get the connected account ID from settings
      const settings = await Settings.get(userId, userId);
      if (!settings?.paymentSettings?.stripeAccountId) {
        throw new Error("Wedding couple has not set up their Stripe account yet");
      }

      // First create a product
      const product = await stripe.products.create({
        name: `${giftId}: Wedding Gift Contribution`,
        metadata: {
          giftId: giftId
        },
      });
      console.log('Created product:', product);

      // Then create a price for this specific contribution
      const price = await stripe.prices.create({
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency: 'sek',
        product: product.id,
      });
      console.log('Created price:', price);
      
      const percentageFee = amount * 0.10; // 10% of the amount
      const fixedFee = 5; // fixed fee of 5 kr
      const totalFee = Math.round((percentageFee + fixedFee) * 100); // convert to cents

      console.log('Total fee:', totalFee);

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
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
        payment_intent_data: {
          application_fee_amount: totalFee,
          transfer_data: {
            destination: settings.paymentSettings.stripeAccountId,
          },
          // on_behalf_of: settings.paymentSettings.stripeAccountId
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
