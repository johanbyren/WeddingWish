# Monorepo Template

A template to create a monorepo SST v3 project. [Learn more](https://sst.dev/docs/set-up-a-monorepo).

## Get started

1. Use this template to [create your own repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

2. Clone the new repo.

   ```bash
   git clone <REPO_URL> MY_APP
   cd MY_APP
   ```

3. Rename the files in the project to the name of your app.

   ```bash
   npx replace-in-file '/wedding-wish/g' 'MY_APP' '**/*.*' --verbose
   ```

4. Set up Stripe environment variables:

   ```bash
   # Set Stripe publishable key (creates .env file for local development)
   sst secrets set STRIPE_PUBLISHABLE_KEY pk_test_your_key_here --fallback

   # Set Stripe secret key (creates .env file for local development)
   sst secrets set STRIPE_SECRET_KEY sk_test_your_key_here --fallback
   ```

   The `--fallback` flag will:
   - Set the secret in AWS Secrets Manager for production/staging
   - Create a `.env` file in your project root for local development
   - Automatically load the values when running `sst dev`
   - Use it like this: `${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`

5. Deploy!

   ```bash
   npm install
   npx sst deploy --stage dev|prod
   ```

6. Optionally, enable [_git push to deploy_](https://sst.dev/docs/console/#autodeploy).

## Usage

To run dev: 
- npx sst dev

This template uses [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). It has 3 packages to start with and you can add more it.

1. `core/`

   This is for any shared code. It's defined as modules. For example, there's the `Example` module.

   ```ts
   export module Example {
     export function hello() {
       return "Hello, world!";
     }
   }
   ```

   That you can use across other packages using.

   ```ts
   import { Example } from "@aws-monorepo/core/example";

   Example.hello();
   ```

   We also have [Vitest](https://vitest.dev/) configured for testing this package with the `sst shell` CLI.

   ```bash
   npm test
   ```

2. `functions/`

   This is for your Lambda functions and it uses the `core` package as a local dependency.

3. `scripts/`

    This is for any scripts that you can run on your SST app using the `sst shell` CLI and [`tsx`](https://www.npmjs.com/package/tsx). For example, you can run the example script using:

   ```bash
   npm run shell src/example.ts
   ```

### Infrastructure

The `infra/` directory allows you to logically split the infrastructure of your app into separate files. This can be helpful as your app grows.

In the template, we have an `api.ts`, and `storage.ts`. These export the created resources. And are imported in the `sst.config.ts`.

### Image Storage and Delivery

The application uses AWS S3 for storing images and CloudFront for delivering them efficiently. Here's how it works:

1. **Storage Setup**:
   - Images are stored in an S3 bucket (`WeddingAssets`)
   - The bucket is configured with CloudFront access for secure and fast delivery

2. **CloudFront Integration**:
   - A CloudFront distribution is set up to serve the S3 bucket contents
   - The distribution is accessible through a router endpoint (`/files`)
   - This setup allows direct access to images through URLs like: `https://[cloudfront-domain]/files/[image-path]`

3. **Usage in Frontend**:
   ```typescript
   // Access images directly through the CloudFront URL
   const imageUrl = `${import.meta.env.VITE_BUCKET_URL}/${imagePath}`;
   ```
   - The `VITE_BUCKET_URL` environment variable contains the CloudFront URL
   - This enables direct image loading without additional API calls
   - Images are served with proper caching headers for optimal performance

This architecture provides:
- Fast global content delivery
- Reduced server load (images served directly from CloudFront)
- Secure access to S3 contents
- Cost-effective image delivery

---

**Join our community** [Discord](https://sst.dev/discord) | [YouTube](https://www.youtube.com/c/sst-dev) | [X.com](https://x.com/SST_dev)
