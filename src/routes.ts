import Elysia from "elysia";
import btRouter from "./bancoTesoro/bt.router";
import miBancoRouter from "./miBanco/miBanco.router";
import usersRouter from "./users/users.router";
import testRouter from "./test/test.router";

const routes = new Elysia({ prefix: "/v1" });

routes.group("/user", (app) => app.use(usersRouter));
routes.group("/bt", (app) => app.use(btRouter));
routes.group("/mibanco", (app) => app.use(miBancoRouter));
routes.group("/test", (app) => app.use(testRouter));

export default routes;
