import { Elysia, t } from "elysia";
import { Stream } from "@elysiajs/stream";

const miBancoApiUrl = process.env.MIBANCO_API_URL;
const miBancoToken = process.env.MIBANCO_TOKEN;

interface Params {
  body?: any;
  set?: any;
  store?: {
    canNotify: boolean;
    data: Record<string, any> | null;
  };
}

async function requestOTPController({ body, set }: Params) {
  try {
    const response = await fetch(
      `${miBancoApiUrl}/coremfibp/api/v1/json/bcoemi/enviar/request/otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${miBancoToken}`,
        },
        body: JSON.stringify(body),
      }
    );

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

async function makePaymentController({ body, set }: Params) {
  try {
    const response = await fetch(
      `${miBancoApiUrl}/coremfibp/api/v1/json/bcoemi/enviar/ddinme`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${miBancoToken}`,
        },
        body: JSON.stringify(body),
      }
    );

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

async function notifyController({ store, body, set }: Params) {
  try {

    if (!store) {
      set.status = "Internal Server Error";
      return { message: "Error interno del servidor" };
    }

    store.canNotify = true;

    if (Object.entries(body).length) {
      store.data = body;
    }

    console.info("[MI_BANCO => NOTIFICATION MIDDLEWARE] => ", JSON.stringify(body, null, 2))

    return { message: "Solicitud recibida" };
  } catch (error) {
    console.log("Notify Controller => ", JSON.stringify(error, null, 2));
    set.status = 500
    store!.canNotify = false;

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

async function emitSSEController({ store, set }: Params) {
  try {
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

      console.info("[MI_BANCO => NOTIFICATION SSE] => ", JSON.stringify(store!.data, null, 2))

      return response;
    }

    // return { message: "OK" };
    return new Stream((stream) => {
      const interval = setInterval(() => {
        stream.send({ message: 'OK' });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        stream.close();
      }, 3000);
    });
  } catch (error) {
    console.log("SSE Controller => ", JSON.stringify(error, null, 2));
    set.status = 500
    return {
      error: "Error interno de servidor",
    }
  }
}

const miBanco = new Elysia({ prefix: "/mibanco" })
  .state("canNotify", false)
  .state("data", null)
  .post("/request-otp", ({ body, set }) => requestOTPController({ body, set }))
  .post("/pay", ({ body, set }) => makePaymentController({ body, set }))
  .post("/notify", ({ store, body, set }) => notifyController({ body, store, set }))
  .get("/notify", ({ store, set }) => emitSSEController({ store, set }));

export default miBanco;
