import Elysia from "elysia";
import usersRouter from "../users/users.router";

// import user from "./user";
// import bancoTesoro from "./bt";
// import miBanco from "./miBanco";

// const routes = new Elysia({ prefix: 'v1' })
//   .use(user)
//   .use(bancoTesoro)
//   .use(miBanco)

// export default routes

const routes = new Elysia({ prefix: "/v1" });

routes.group("/user", (app) => app.use(usersRouter));

export default routes;
