import type { RegisterPaymentPayload } from "./types";

const userApiKey = process.env.USERS_API_KEY;
const userApiUrl = process.env.USERS_API_URL;

async function fetchUserApi(endpoint: string, body: any) {
  return fetch(`${userApiUrl}${endpoint}`, {
    method: "POST",
    body: JSON.stringify({
      token: userApiKey,
      ...body,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getClientsDetails(ci: string) {
  return fetchUserApi("/api/v1/GetClientsDetails", { cedula: ci });
}

export async function getDebt(ci: string) {
  return fetchUserApi("/facilito/consultadeuda", { cedula: ci });
}

export async function registerPayment(payload: RegisterPaymentPayload) {
  return fetchUserApi("/facilito/registrarpago", {
    token: userApiKey,
    ...payload,
  });
}
