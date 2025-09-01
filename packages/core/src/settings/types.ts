import { z } from "zod";

export const accountSettingsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  partner1Name: z.string(),
  partner2Name: z.string(),
  weddingDate: z.string(), // Store as ISO string
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  phoneNumber: z.object({
    countryCode: z.string(),
    number: z.string(),
  }),
});

export const pageSettingsSchema = z.object({
  visibility: z.enum(["public", "password", "private"]),
  customUrl: z.string(),
  theme: z.enum(["classic", "modern", "rustic", "elegant", "minimalist"]),
  primaryColor: z.enum(["pink", "blue", "green", "purple", "gold"]),
});

export const paymentSettingsSchema = z.object({
  paymentMethod: z.enum(["klarna", "swish", "stripe", "paypal"]),
  accountEmail: z.string().email(),
  notifyOnContribution: z.boolean(),
  autoThankYou: z.boolean(),
  stripeAccountId: z.string().optional(),
  swishPhoneNumber: z.string().optional(),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  contributionAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
});

export const privacySettingsSchema = z.object({
  showContributorNames: z.boolean(),
  showContributionAmounts: z.boolean(),
  allowGuestComments: z.boolean(),
  showRegistry: z.boolean(),
});

export const settingsSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  accountSettings: accountSettingsSchema.optional(),
  pageSettings: pageSettingsSchema.optional(),
  paymentSettings: paymentSettingsSchema.optional(),
  notificationSettings: notificationSettingsSchema.optional(),
  privacySettings: privacySettingsSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type AccountSettingsType = z.infer<typeof accountSettingsSchema>;
export type PageSettingsType = z.infer<typeof pageSettingsSchema>;
export type PaymentSettingsType = z.infer<typeof paymentSettingsSchema>;
export type NotificationSettingsType = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettingsType = z.infer<typeof privacySettingsSchema>;
export type SettingsType = z.infer<typeof settingsSchema>;
