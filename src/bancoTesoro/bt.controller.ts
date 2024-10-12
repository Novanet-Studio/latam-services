import Logger from "../logger";
import { getBanks, getOTP, makeConfirmation, makePayment } from "./bt.service";

interface Params {
  body?: any;
  set: any;
}

const logger = new Logger("bancoTesoro");

export async function getBanksHandler({ set }: Params) {
  try {
    const response = await getBanks();
    const json = await response.json();

    logger.info(json[0] || {}, "get_banks");

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "banks_error");

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

    logger.info(payload, "boton_de_pago_payload");

    const response = await makePayment(payload);
    const json = await response.json();

    logger.info(json, "boton_de_pago_response");

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
