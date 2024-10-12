import { getBanks, getOTP, makeConfirmation, makePayment } from "./bt.service";

interface Params {
  body?: any;
  set: any;
}

export async function getBanksHandler({ set }: Params) {
  try {
    const response = await getBanks();
    const json = await response.json();

    console.info("[BT => BANKS] => ", JSON.stringify(json[0] || {}, null, 2));

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    console.info("[BT => ERROR => BANKS] => ", JSON.stringify(error, null, 2));

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function getOTPHandler({ body, set }: Params) {
  try {
    const response = await getOTP(body.celularDestino);
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

export async function paymentHandler({ body, set }: Params) {
  try {
    const payload = {
      celular: body.celular,
      banco: body.banco,
      cedula: body.cedula,
      monto: body.monto,
      token: body.token,
      nombre: body.nombre,
    };

    console.info(
      "[BT => BOTON_DE_PAGO => PAYLOAD] => ",
      JSON.stringify(payload, null, 2)
    );

    const response = await makePayment(payload);
    const json = await response.json();

    console.info(
      "[BT => BOTON_DE_PAGO => RESPONSE] => ",
      JSON.stringify(json, null, 2)
    );

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function conformationHandler({ body, set }: Params) {
  try {
    const response = await makeConfirmation(body);
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
