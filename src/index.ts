import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import routes from "./routes";

const PORT = Number(process.env.PORT) || 8001;

const app = new Elysia({ prefix: "/api" })
  .use(routes)
  .use(cors())
  .listen(PORT);

console.log(
  `🦊 LATAM services is running at ${app.server?.hostname}:${app.server?.port}`
);
