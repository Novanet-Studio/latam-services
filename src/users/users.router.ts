import { Elysia } from "elysia";
import {
  getClientsDetailsHandler,
  getDebtHandler,
  registerPaymentHandler,
} from "./users.controller";
import {
  getClientsDetailsDto,
  getDebtDto,
  registerPaymentDto,
} from "./users.dto";

const usersRouter = new Elysia();

usersRouter.post("/get-client-details", getClientsDetailsHandler, {
  body: getClientsDetailsDto,
});

usersRouter.post("/consulta-deuda", getDebtHandler, {
  body: getDebtDto,
});

usersRouter.post("/registrar-pago", registerPaymentHandler, {
  body: registerPaymentDto,
});

export default usersRouter;
