export async function test1() {
  return fetch(`https://box.btc.com.ve:3009/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function test2() {
  return fetch(`https://fake-json-api.mock.beeceptor.com/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

