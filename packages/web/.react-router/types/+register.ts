import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/login": {};
  "/register": {};
  "/dashboard": {};
  "/dashboard/gifts": {};
  "/dashboard/create": {};
  "/dashboard/settings": {};
  "/wedding/:id": {
    "id": string;
  };
  "/wedding/:id/contribute/:giftId": {
    "id": string;
    "giftId": string;
  };
  "/wedding/:id/thank-you": {
    "id": string;
  };
};