import { Elysia, t } from "elysia";

const userApiKey = process.env.USERS_API_KEY;
const userApiUrl = process.env.USERS_API_URL;

interface Params {
  body: any;
  set: any;
}

async function getClientsDetailsController({ body, set }: Params) {
  try {
    const response = await fetch(`${userApiUrl}/api/v1/GetClientsDetails`, {
      method: "POST",
      body: JSON.stringify({
        token: userApiKey,
        cedula: body.cedula,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    console.log("[get-client-details] =>", error);

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

async function getDebtController({ body, set }: Params) {
  try {
    const response = await fetch(`${userApiUrl}/facilito/consultadeuda`, {
      method: "POST",
      body: JSON.stringify({
        token: userApiKey,
        cedula: body.cedula,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    console.log("[consulta-deuda] => ", error);

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

async function registerPaymentController({ body, set }: Params) {
  try {
    const payload = {
      token: userApiKey,
      IDFactura: body.IDFactura,
      valor: body.valor,
      fecha: body.fecha,
      secuencial: body.secuencial,
    };

    const response = await fetch(`${userApiUrl}/facilito/registrarpago`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    console.log("[registrar-pago] => ", error);

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

const user = new Elysia({ prefix: "/user" })
  .post(
    "/get-client-details",
    ({ body, set }) => {
      return getClientsDetailsController({ body, set });
    },
    {
      body: t.Object({
        cedula: t.String(),
      }),
    }
  )
  .post(
    "/consulta-deuda",
    ({ body, set }) => {
      return getDebtController({ body, set });
    },
    {
      body: t.Object({
        cedula: t.String(),
      }),
    }
  )
  .post(
    "/registrar-pago",
    ({ body, set }) => {
      return registerPaymentController({ body, set });
    },
    {
      body: t.Object({
        IDFactura: t.Number(),
        valor: t.Number(),
        fecha: t.String(),
        secuencial: t.Number(),
      }),
    }
  );

export default user;
