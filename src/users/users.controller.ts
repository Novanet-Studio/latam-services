import Logger from "../logger";
import { getClientsDetails, getDebt, registerPayment } from "./users.service";

interface Params {
  body: any;
  set: any;
}

const logger = new Logger("users");

export async function getClientsDetailsHandler({ body, set }: Params) {
  try {
    const response = await getClientsDetails(body.cedula);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "get_client_details_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function getDebtHandler({ body, set }: Params) {
  try {
    const response = await getDebt(body.cedula);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "consulta_deuda_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

export async function registerPaymentHandler({ body, set }: Params) {
  try {
    const payload = {
      IDFactura: body.IDFactura,
      valor: body.valor,
      fecha: body.fecha,
      secuencial: body.secuencial,
    };

    const response = await registerPayment(payload);
    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    logger.info(error, "registrar_pago_error");

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}
