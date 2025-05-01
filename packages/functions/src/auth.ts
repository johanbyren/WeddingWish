import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { issuer } from "@openauthjs/openauth";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import type { Theme } from "@openauthjs/openauth/ui/theme";
import { subjects } from "@wedding-wish/core/subjects";
import { User } from "@wedding-wish/core/user";
import { handle } from "hono/aws-lambda";
import { Resource } from "sst/resource";

const storage = DynamoStorage({
  table: "Auth",
  pk: "pk",
  sk: "sk",
});

const WEDDINGWISH_THEME: Theme = {
  title: "Wedding Wish - Log in",
  radius: "lg",
  favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-heart-icon lucide-heart'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/></svg>",
  primary: "#ec4899",
  background: "#FFF",
  logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-heart-icon lucide-heart'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/></svg>",
  font: {
    scale: "1.2",
    family: "Inter, sans-serif",
  },
  css: `
      [data-component="logo"] {
        height: 2rem;
      }
      [data-component="form-footer"] {
        font-size: 0.9em;
      }
      [data-component="form"] {
        background: white;
        border-radius: 0.625rem;
      }
      [data-component="button"] {
        transition: background-color 0.2s ease-in-out;
      }
      [data-component="button"]:hover {
        background-color: #db2777;
      }
      [data-component="input"] {
        height: 2.25rem;
        width: 100%;
        border-radius: 0.375rem;
        border: 1px solid #e5e7eb;
        background-color: transparent;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        transition: all 0.2s ease-in-out;
      }
      [data-component="input"]:focus {
        outline: none;
        --tw-ring-color: #e5e7eb;
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-shadow);
      }
      [data-component="input"]::placeholder {
        color: #9ca3af;
      }
      [data-component="form-alert"][data-color="success"] {
        --color-background-success: #f3f4f6;
        --color-success: #4b5563;
        background: var(--color-background-success);
        color: var(--color-success);
      }
  `,
};

const client = new SESv2Client();

const app = issuer({
  theme: WEDDINGWISH_THEME,
  subjects,
  providers: {
    code: CodeProvider(
      CodeUI({
        copy: {
          email_placeholder: "Email address",
          email_invalid: "The email address you entered does not have access to this system.",
          button_continue: "Log in",
          code_info: "We will send a verification code to your email address.",
          code_didnt_get: "Didn't receive the verification code?",
          code_invalid: "Invalid verification code",
          code_placeholder: "Verification code",
          code_resend: "Send again",
          code_resent: "Verification code sent again",
          code_sent: "Verification code sent to ",
        },
        sendCode: async (claims, code) => {
          console.log('hej claims: ', claims);
          console.log('hej code: ', code);
          await client.send(
            new SendEmailCommand({
              FromEmailAddress: Resource.Email.sender,
              Destination: {
                ToAddresses: [claims.email],
              },
              Content: {
                Simple: {
                  Subject: {
                    Data: `Verification code - ${code}`,
                  },
                  Body: {
                    Text: {
                      Data: `Here is your verification code to log in on Wedding Wish: ${code}`,
                    },
                  },
                },
              },
            }),
          );
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    console.log('hej ctx: ', ctx);
    console.log('hej value: ', value);

    if (value.provider === "code") {
        console.log('Code provider');
      const user = await User.get(value.claims.email);

      if (!user) {
        console.log('User not found, creating user');
         await User.create({
          email: value.claims.email,
        });

        return ctx.subject("user", {
          email: value.claims.email,
        });
      }

      console.log('User found, returning user');
      return ctx.subject("user", {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
    throw new Error("Invalid provider");
  },
  storage,
});

export const handler = handle(app);
