import Elysia from "elysia";
import {
  emitSSEHandler,
  makePaymentHandler,
  notifyHandler,
  requestOTPHandler,
} from "./miBanco.controller";

const miBancoRouter = new Elysia();

miBancoRouter.state("canNotify", false);
miBancoRouter.state("data", null);

miBancoRouter.post("/request-otp", requestOTPHandler);
miBancoRouter.post("/pay", makePaymentHandler);
miBancoRouter.post("/notify", notifyHandler);
miBancoRouter.get("/notify", emitSSEHandler);

export default miBancoRouter;
