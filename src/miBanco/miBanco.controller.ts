import { Stream } from "@elysiajs/stream";
import { payment, requestOTP } from "./miBanco.service";
import Logger from "../logger";

interface Params {
  body?: any;
  set?: any;
  store?: {
    canNotify: boolean;
    data: Record<string, any> | null;
  };
}

const logger = new Logger("miBanco");

export async function requestOTPHandler({ body, set }: Params) {
  try {
    const response = await requestOTP(body);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";
    logger.info(error, "request_otp_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function makePaymentHandler({ body, set }: Params) {
  try {
    const response = await payment(body);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "payment_execution_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function notifyHandler({ store, body, set }: Params) {
  logger.info("<<< START notifyHandler");

  try {
    if (!store) {
      set.status = "Internal Server Error";
      return { message: "Error interno del servidor" };
    }

    store.canNotify = true;

    if (Object.entries(body).length) {
      store.data = body;
    }

    logger.info(body, "notification_middleware");

    return { message: "Solicitud recibida" };
  } catch (error) {
    logger.info(error, "notify_controller_error");
    set.status = 500;
    store!.canNotify = false;

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function emitSSEHandler({ store, set }: Params) {
  try {
    logger.info(store?.canNotify, "emit_sse_can_notify");

    if (store?.canNotify) {
      const response = new Stream((stream) => {
        const interval = setInterval(() => {
          stream.send(JSON.stringify(store!.data));
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
          stream.close();
        }, 3000);
      });

      store.canNotify = false;

      logger.info(store!.data, "notification_sse");

      return response;
    }

    return new Stream((stream) => {
      const interval = setInterval(() => {
        stream.send({ message: "OK" });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        stream.close();
      }, 3000);
    });
  } catch (error) {
    logger.info(error, "sse_controller_error");
    set.status = 500;
    return {
      error: "Error interno de servidor",
    };
  }
}
