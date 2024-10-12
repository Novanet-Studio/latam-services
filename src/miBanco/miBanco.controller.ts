import { Stream } from "@elysiajs/stream";
import { payment, requestOTP } from "./miBanco.service";

interface Params {
  body?: any;
  set?: any;
  store?: {
    canNotify: boolean;
    data: Record<string, any> | null;
  };
}

export async function requestOTPHandler({ body, set }: Params) {
  try {
    const response = await requestOTP(body);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";
    console.error("MI_BANCO [request-otp] => ", JSON.stringify(error, null, 2));

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

    console.error(
      "MI_BANCO [pay execution] => ",
      JSON.stringify(error, null, 2)
    );

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function notifyHandler({ store, body, set }: Params) {
  try {
    if (!store) {
      set.status = "Internal Server Error";
      return { message: "Error interno del servidor" };
    }

    store.canNotify = true;

    if (Object.entries(body).length) {
      store.data = body;
    }

    console.info(
      "[MI_BANCO => NOTIFICATION MIDDLEWARE] => ",
      JSON.stringify(body, null, 2)
    );

    return { message: "Solicitud recibida" };
  } catch (error) {
    console.log("Notify Controller => ", JSON.stringify(error, null, 2));
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
    console.log("store?.canNotify ->", store?.canNotify);
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

      console.info(
        "[MI_BANCO => NOTIFICATION SSE] => ",
        JSON.stringify(store!.data, null, 2)
      );

      return response;
    }

    // return { message: "OK" };
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
    console.log("SSE Controller => ", JSON.stringify(error, null, 2));
    set.status = 500;
    return {
      error: "Error interno de servidor",
    };
  }
}
