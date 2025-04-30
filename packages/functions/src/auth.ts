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
  // favicon: // TODO: move behind cloudfront url
    // "https://usercontent.one/wp/www.dysmeli.se/wp-content/uploads/cropped-dysmelilogga-32x32.png?media=1672743750",
  primary: "#44A949",
  background: "#FFF",
//   logo: "https://usercontent.one/wp/www.dysmeli.se/wp-content/uploads/cropped-Logga_Ny-2.jpg?media=1672743750",
  font: {
    scale: "1.2",
    family: "Inter, sans-serif",
  },
  css: `
      [data-component="logo"] {
        height: 15rem;
      }
      [data-component="form-footer"] {
        font-size: 0.9em;
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
        console.log('hej code provider');
      const user = await User.get(value.claims.email);

      if (!user) {
        console.log('hej user not found, creating user');
         await User.create({
          email: value.claims.email,
        });

        return ctx.subject("user", {
          email: value.claims.email,
        });
      }

      console.log('hej user found, returning user');
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
