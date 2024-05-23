import Elysia from "elysia";

import user from "./user";
import bancoTesoro from "./bt";
import miBanco from "./miBanco";

const routes = new Elysia({ prefix: 'v1' })
  .use(user)
  .use(bancoTesoro)
  .use(miBanco)

export default routes
