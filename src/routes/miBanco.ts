import { Elysia, t } from "elysia";

const miBancoApiUrl = process.env.MIBANCO_API_URL;
const miBancoToken = process.env.MIBANCO_TOKEN;

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
        "Authorization": `Bearer ${miBancoToken}`
      },
      body: JSON.stringify(body)
    });

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
    const response = await fetch(`${miBancoApiUrl}/coremfibp/api/v1/json/bcoemi/enviar/ddinme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${miBancoToken}`
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    console.error("MI_BANCO [pay execution] => ", JSON.stringify(error, null, 2));

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
