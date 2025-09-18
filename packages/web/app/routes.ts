import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/register", "routes/register.tsx"),
  route("/learn-more", "routes/learn-more.tsx"),
  route("/dashboard", "components/protected-route.tsx", [
    route("", "dashboard/page.tsx", [
      route("", "dashboard/wedding-details.tsx"),
      route("gifts", "dashboard/gifts/page.tsx"),
      route("create", "dashboard/create/page.tsx"),
      route("settings", "dashboard/settings/page.tsx"),
    ]),
  ]),
  route("/:slug", "routes/wedding/WeddingPage.tsx"),
  route("/:slug/contribute/:giftId", "routes/wedding/Contribute.tsx"),
  route("/:slug/thank-you", "routes/wedding/ThankYou.tsx"),
] satisfies RouteConfig;
