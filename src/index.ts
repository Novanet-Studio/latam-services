import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const PORT = Number(process.env.PORT) || 3001;
const userApiKey = process.env.USERS_API_KEY;
const userApiUrl = process.env.USERS_API_URL;
const btApiUrl = process.env.BT_BASE_API_URL;

const bussinessRif = process.env.BUSSINESS_RIF;
const bussinessName = process.env.BUSSINESS_NAME;
const bussinessAfiliatedCode = process.env.AFILIATED_CODE;

const app = new Elysia({ prefix: "/api" });

app.use(cors());

app.post(
  "/get-client-details",
  async ({ body, set }) => {
    try {
      const response = await fetch(`${userApiUrl}/GetClientsDetails`, {
        method: "POST",
        body: JSON.stringify({
          token: userApiKey,
          cedula: body.cedula,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();

      return json;
    } catch (error) {
      set.status = "Internal Server Error";

      return {
        status: "Internal Server Error",
        error: "Error interno de servidor",
      };
    }
  },
  {
    body: t.Object({
      cedula: t.String(),
    }),
  }
);

app.post("/bancos", async ({ set }) => {
  try {
    const response = await fetch(`${btApiUrl}/bancos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
});

app.post(
  "/clave",
  async ({ body, set }) => {
    try {
      const response = await fetch(`${btApiUrl}/lotes/solicitud/clave`, {
        method: "POST",
        body: JSON.stringify({
          canal: "01",
          celularDestino: body.celularDestino,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      return json;
    } catch (error) {
      set.status = "Internal Server Error";

      return {
        status: "Internal Server Error",
        error: "Error interno de servidor",
      };
    }
  },
  {
    body: t.Object({
      celularDestino: t.String(),
    }),
  }
);

app.post(
  "/pago",
  async ({ body, set }) => {
    try {
      const response = await fetch(`${btApiUrl}/botonDePago/pago`, {
        method: "POST",
        body: JSON.stringify({
          canal: "06",
          celular: body.celular,
          banco: body.banco,
          RIF: bussinessRif,
          cedula: body.cedula,
          monto: body.monto,
          token: body.token,
          concepto: `Pago de servicios de ${body.nombre}`,
          codAfiliado: bussinessAfiliatedCode,
          comercio: bussinessName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      return json;
    } catch (error) {
      set.status = "Internal Server Error";

      return {
        status: "Internal Server Error",
        error: "Error interno de servidor",
      };
    }
  },
  {
    body: t.Object({
      celular: t.String(),
      banco: t.String(),
      cedula: t.String(),
      monto: t.String(),
      token: t.String(),
      nombre: t.String(),
    }),
  }
);

app.post(
  "/conformacion",
  async ({ body, set }) => {
    try {
      const response = await fetch(`${btApiUrl}/botonDePago/conformacion`, {
        method: "POST",
        body: JSON.stringify({
          referencia: body.referencia,
          monto: body.monto,
          banco: body.banco,
          codAfiliado: bussinessAfiliatedCode,
          fecha: body.fecha,
          celular: body.celular,
          RIF: bussinessRif,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      return json;
    } catch (error) {
      set.status = "Internal Server Error";

      return {
        status: "Internal Server Error",
        error: "Error interno de servidor",
      };
    }
  },
  {
    body: t.Object({
      referencia: t.String(),
      monto: t.String(),
      banco: t.String(),
      fecha: t.String(),
      celular: t.String(),
    }),
  }
);

app.listen(PORT);

console.log(
  `🦊 LATAM services is running at ${app.server?.hostname}:${app.server?.port}`
);
