const miBancoApiUrl = process.env.MIBANCO_API_URL;
const miBancoToken = process.env.MIBANCO_TOKEN;

async function fetchMiBancoApi(endpoint: string, body?: any) {
  return fetch(`${miBancoApiUrl}${endpoint}`, {
    method: "POST",
    body: JSON.stringify({
      ...body,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${miBancoToken}`,
    },
  });
}

export async function requestOTP(body: any) {
  return fetchMiBancoApi(
    "/coremfibp/api/v1/json/bcoemi/enviar/request/otp",
    body
  );
}

export async function payment(body: any) {
  return fetchMiBancoApi("/coremfibp/api/v1/json/bcoemi/enviar/ddinme", body);
}
