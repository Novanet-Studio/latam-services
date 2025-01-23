import { Stream } from "@elysiajs/stream";
import { payment, requestOTP } from "./miBanco.service";
import Logger from "../logger";

interface Params {
  params?: any;
  body?: any;
  set?: any;
  store?: {
    data: Record<any, any>[] | null;
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
  logger.info(JSON.stringify(body), "ON makePaymentHandler (body)");

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

export async function notifyHandler({ store, body, set }: any) {
  logger.info(JSON.stringify(body), "ON notifyHandler (body)");

  try {
    if (!store) {
      set.status = "Internal Server Error";
      return { message: "Error interno del servidor" };
    }

    if (Object.entries(body).length) {
      store.data = store.data ? [...store.data, body] : [body];
    }

    return { message: "Solicitud recibida" };
  } catch (error) {
    logger.info(error, "notify_controller_error");
    set.status = 500;

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function emitSSEHandler({ params, store, set }: Params) {
  const msgId = params.msgId;
  let msg: any;

  let threadFound = false;

  try {
    const source = store!.data!;

    if (source.length === 0) threadFound = false;

    if (source.length > 0) {
      msg = source.find(
        (m) => m.CstmrPmtStsRpt.OrgnlGrpInfAndSts.OrgnlMsgId === msgId
      );

      if (msg) {
        threadFound = true;

        store!.data! = source.filter(
          (m) => m.CstmrPmtStsRpt.OrgnlGrpInfAndSts.OrgnlMsgId !== msgId
        );
      }
    }
  } catch (e) {
    logger.info(e, "threadFound error");
  }

  try {
    const response = new Stream((stream) => {
      const interval = setInterval(() => {
        try {
          if (threadFound) {
            logger.info(
              JSON.stringify(msg),
              "RETURNED BY emitSSEHandler (msg)"
            );

            try {
              stream.send(`${JSON.stringify(msg)}`);
            } catch {
              logger.info(msgId, "forced closure for thread");
            }

            try {
              stream.close();
            } catch {
              logger.info(msgId, "forced closure for thread");
            }

            clearInterval(interval);
          } else {
            try {
              stream.send(`${JSON.stringify({ message: "OK" })}`);
            } catch {
              logger.info(msgId, "forced closure for thread");
            }
          }
        } catch {}
      }, 500);

      setTimeout(() => {
        clearInterval(interval);

        try {
          stream.close();
        } catch (e) {}
      }, 3000);
    });

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
