import { getClientsDetails, getDebt, registerPayment } from "./users.service";

interface Params {
  body: any;
  set: any;
}

export async function getClientsDetailsHandler({ body, set }: Params) {
  try {
    const response = await getClientsDetails(body.cedula);
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

export async function getDebtHandler({ body, set }: Params) {
  try {
    const response = await getDebt(body.cedula);
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

    console.log("[registrar-pago] => ", error);

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}
