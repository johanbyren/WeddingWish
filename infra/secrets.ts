// Create secrets for Stripe keys
export const stripeSecretKey = new sst.Secret("STRIPE_SECRET_KEY");
export const stripePublishableKey = new sst.Secret("STRIPE_PUBLISHABLE_KEY");
export const stripeAccountId = new sst.Secret("STRIPE_ACCOUNT_ID");

// Create secret for Google Maps API key
export const googleMapsApiKey = new sst.Secret("GOOGLE_MAPS_API_KEY"); 