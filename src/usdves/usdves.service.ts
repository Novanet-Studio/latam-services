const DOLAR_API_API_URL = process.env.DOLAR_API_API_URL;
const FAWAZAHMED0_API_URL = process.env.FAWAZAHMED0_API_URL;

export async function getUsdVes_dolarApi() {
  const url = `${DOLAR_API_API_URL}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getUsdVes_fawazahmed0() {
  const url = `${FAWAZAHMED0_API_URL}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

