import Elysia from "elysia";

const whitelist: string[] = process.env.WHITELIST?.split(",") || [];

export const whitelistMiddleware = (app: Elysia) =>
  app.on("request", ({ request: req, set }) => {
    console.log(`<<< req >>>`, req);

    const h: string = req.headers.get("host");

    console.log(`<<< h >>>`, h);

    if (!whitelist.includes(h)) {
      set.status = 403;
      return { error: "Access denied. Ip not allowed." };
    }
  });

export default whitelistMiddleware;
