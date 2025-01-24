import Elysia from "elysia";

const whitelist: string[] = process.env.WHITELIST?.split(",") || [];
const ctrlLogger: any = process.env.CTRL_LOGGER === "true";

export const whitelistMiddleware = (app: Elysia) =>
  app.on("request", ({ request: req, set }) => {
    const urlOrigin: string = req.headers.get("origin") || "";
    const ipOrigin: string = req.headers.get("x-forwarded-for") || "";

    if (ctrlLogger) {
      console.log(`<<< req >>>`, req);
      console.log(`<<< urlOrigin >>>`, urlOrigin);
      console.log(`<<< ipOrigin >>>`, ipOrigin);
    }

    if (!whitelist.includes(urlOrigin) && !whitelist.includes(ipOrigin)) {
      set.status = 403;
      return { error: "Access denied. Ip not allowed." };
    }
  });

export default whitelistMiddleware;

// git commit -m "fe
