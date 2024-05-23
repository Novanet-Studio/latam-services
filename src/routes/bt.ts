import { Elysia, t } from "elysia";

const btApiUrl = process.env.BT_BASE_API_URL;
const bussinessRif = process.env.BUSSINESS_RIF;
const bussinessName = process.env.BUSSINESS_NAME;
const bussinessAfiliatedCode = process.env.AFILIATED_CODE;

interface Params {
  body?: any;
  set: any;
}

async function fetchBanksController({ set }: Params) {
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
}

async function fetchOTPController({ body, set }: Params) {
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
}

async function makePaymentController({ body, set }: Params) {
  try {
    const payload = {
      canal: "06",
      celular: body.celular,
      banco: body.banco,
      RIF: bussinessRif,
      cedula: body.cedula,
      monto: body.monto,
      token: body.token,
      concepto: `Pago de servicios de ${body.nombre}`,
      codAfiliado: bussinessAfiliatedCode,
      comercio: '',
    }

    console.info("[BT => BOTON_DE_PAGO => PAYLOAD] ==>> ", JSON.stringify(payload, null, 2))

    const response = await fetch(`${btApiUrl}/botonDePago/pago`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    console.info("[BT => BOTON_DE_PAGO => RESPONSE] => ", JSON.stringify(json, null, 2))

    return json;
  } catch (error) {
    set.status = "Internal Server Error";

    return {
      status: "Internal Server Error",
      error: "Error interno de servidor",
    };
  }
}

async function makeConformationController({ body, set }: Params) {
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
}

const bancoTesoro = new Elysia({ prefix: "/bt" })
  .post("/bancos", ({ set }) =>
    fetchBanksController({ set })
  )
  .post("/clave", ({ body, set }) => fetchOTPController({ body, set }), {
    body: t.Object({
      celularDestino: t.String(),
    }),
  })
  .post('/pago', ({ body, set }) => makePaymentController({ body, set }), {
    body: t.Object({
      celular: t.String(),
      banco: t.String(),
      cedula: t.String(),
      monto: t.String(),
      token: t.String(),
      nombre: t.String(),
    }),
  })
  .post('/conformation', ({ body, set }) => makeConformationController({ body, set }), {
    body: t.Object({
      referencia: t.String(),
      monto: t.String(),
      banco: t.String(),
      fecha: t.String(),
      celular: t.String(),
    }),
  });

export default bancoTesoro;
