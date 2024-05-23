import { Elysia, t } from "elysia";

const miBancoApiUrl = process.env.MIBANCO_API_URL;

interface Params {
  body?: any;
  set: any;
}

async function requestOTPController({ body, set }: Params) {
  try {
    const response = await fetch(`${miBancoApiUrl}/coremfibp/api/v1/json/bcoemi/enviar/request/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

async function makePaymentController({ body, set }: Params) {
  try {
    const response = await fetch(`${miBancoApiUrl}/coremfibp/api/v1/json/bcoemi/enviar/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();

    return json;
  } catch (error) {
    
    set.status = "Internal Server Error";

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

const miBanco = new Elysia({ prefix: "/mibanco" })
  .post("/request-otp", ({ body, set }) =>
    requestOTPController({ body, set })
  )
  .post("/pay", ({ body, set }) => makePaymentController({ body, set }))

export default miBanco;
