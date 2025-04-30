import { email } from "./email";
import { usersTable } from "./storage";

export const auth = new sst.aws.Auth("AuthApi", {
  issuer: {
    handler: "packages/functions/src/auth.handler",
    link: [usersTable, email],
  },
//   domain: $app.stage === "dev" ? "auth.sdf.elva.land" : undefined,
});
