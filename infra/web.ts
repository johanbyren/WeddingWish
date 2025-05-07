import { api } from "./api";
import { auth } from "./auth";
import { router } from "./router";

new sst.aws.StaticSite("React", {
  path: "packages/web",
  build: {
    command: "npm run build",
    output: "build/client"
  },
  environment: {
    VITE_API_URL: api.url,
    VITE_AUTH_URL: auth.url,
    VITE_BUCKET_URL: $interpolate`${router.url}/files`
  },
  assets: {
    fileOptions: [
      {
        files: "**",
        cacheControl: "public, max-age=31536000, immutable"
      }
    ]
  }
//   domain: $app.stage === "dev" ? "sdf.elva.land" : undefined, // TODO: add later when we have a domain
});
