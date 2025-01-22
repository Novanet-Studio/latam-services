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
  console.log(`<<< ON makePaymentHandler (body)`, JSON.stringify(body));

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
  console.log(`<<< ON notifyHandler (body)`, JSON.stringify(body));

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

    const response = new Stream((stream) => {
      const interval = setInterval(() => {
        if (store?.canNotify) {
          console.log(
            `<<< TO RETURN emitSSEHandler (store) >>>`,
            `${JSON.stringify(store)}`
          );

          stream.send(`${JSON.stringify(store!.data)}`);

          store.canNotify = false;

          stream.close();
          clearInterval(interval);
        } else {
          stream.send(`${JSON.stringify({ message: "OK" })}`);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(interval);

        store!.canNotify = false;

        try {
          stream.close();
        } catch (e) {}
      }, 3000);
    });

    // Cabeceras SSE
    set.headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    };

    return response;
  } catch (error) {
    logger.info(error, "sse_controller_error");
    set.status = 500;
    return {
      error: "Error interno de servidor",
    };
  }
}
