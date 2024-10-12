import Elysia from "elysia";
import usersRouter from "../users/users.router";
import btRouter from "../bancoTesoro/bt.router";
import miBancoRouter from "../miBanco/miBanco.router";

const routes = new Elysia({ prefix: "/v1" });

routes.group("/user", (app) => app.use(usersRouter));
routes.group("/bt", (app) => app.use(btRouter));
routes.group("/mibanco", (app) => app.use(miBancoRouter));

export default routes;
