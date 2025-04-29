import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "components/protected-route.tsx", [
    route("", "dashboard/page.tsx", [
      route("", "dashboard/wedding-details.tsx"),
      route("gifts", "dashboard/gifts/page.tsx"),
      route("create", "dashboard/create/page.tsx"),
      route("settings", "dashboard/settings/page.tsx"),
    ]),
  ]),
  route("/wedding/:id", "routes/wedding/WeddingPage.tsx"),
  route("/wedding/:id/contribute/:giftId", "routes/wedding/Contribute.tsx"),
  route("/wedding/:id/thank-you", "routes/wedding/ThankYou.tsx"),
] satisfies RouteConfig;
