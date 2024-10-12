import { getConcept } from "./bt.utils";
import type { MakeConfirmationPayload, MakePaymentPayload } from "./bt.types";

const btApiUrl = process.env.BT_BASE_API_URL;
const rif = process.env.BUSSINESS_RIF;
const affiliatedCode = process.env.AFILIATED_CODE;

async function fetchBtApi(endpoint: string, body?: any) {
  return fetch(`${btApiUrl}${endpoint}`, {
    method: "POST",
    body: JSON.stringify({
      ...body,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getBanks() {
  return fetchBtApi("/bancos");
}

export async function getOTP(destination: string) {
  return fetchBtApi("/lotes/solicitud/clave", {
    canal: "01",
    celularDestino: destination,
  });
}

export async function makePayment(payload: MakePaymentPayload) {
  return fetchBtApi("/botonDePago/pago", {
    ...payload,
    canal: "06",
    RIF: rif,
    codAfiliado: affiliatedCode,
    concepto: getConcept(payload.nombre),
    comercio: "",
  });
}

export async function makeConfirmation(payload: MakeConfirmationPayload) {
  return fetchBtApi("/botonDePago/conformacion", {
    ...payload,
    codAfiliado: affiliatedCode,
    RIF: rif,
  });
}
