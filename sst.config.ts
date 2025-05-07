/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "wedding-wish",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    await import("./infra/storage");
    await import("./infra/email");
    await import("./infra/api");
    await import("./infra/auth");
    await import("./infra/router");
    await import("./infra/web");
  },
});
