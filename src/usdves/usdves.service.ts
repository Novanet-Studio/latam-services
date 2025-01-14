const API_1_KEY = process.env.USDVES1_API_URL;

export async function getUsdVes1() {
  const url = `${API_1_KEY}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
