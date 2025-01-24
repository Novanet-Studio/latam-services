import Elysia from "elysia";

const whitelist: string[] = process.env.WHITELIST?.split(",") || [];

export const whitelistMiddleware = (app: Elysia) =>
  app.on("request", ({ request: req, set }) => {
    console.log(`<<< req >>>`, req);

    const origin: string = req.headers.get("origin");

    if (!whitelist.includes(origin)) {
      set.status = 403;
      return { error: "Access denied. Ip not allowed." };
    }
  });

export default whitelistMiddleware;
