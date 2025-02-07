import Elysia from "elysia";
import {
  emitSSEHandler,
  makePaymentHandler,
  notifyHandler,
  requestOTPHandler,
} from "./miBanco.controller";

const miBancoRouter = new Elysia();

miBancoRouter.state("data", []);

miBancoRouter.post("/request-otp", requestOTPHandler);
miBancoRouter.post("/pay", makePaymentHandler);
miBancoRouter.post("/notify", notifyHandler);
miBancoRouter.get("/notify/:msgId", emitSSEHandler);

export default miBancoRouter;
