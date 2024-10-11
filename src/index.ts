import { Elysia, t } from "elysia";
import { logger } from "@chneau/elysia-logger";
import { cors } from "@elysiajs/cors";
import routes from "./routes";

const PORT = Number(process.env.PORT) || 8001;

const app = new Elysia({ prefix: "/api" });

app.use(cors());
app.use(logger());

// Routes
app.use(routes);

// Run server
app.listen(PORT);

console.log(
  `🦊 LATAM services is running at ${app.server?.hostname}:${app.server?.port}`
);
