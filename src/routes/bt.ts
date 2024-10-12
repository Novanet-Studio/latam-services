// import { Elysia, t } from "elysia";
// import { makePayment } from "../bancoTesoro/bt.service";

// const btApiUrl = process.env.BT_BASE_API_URL;
// const bussinessRif = process.env.BUSSINESS_RIF;
// const bussinessName = process.env.BUSSINESS_NAME;
// const bussinessAfiliatedCode = process.env.AFILIATED_CODE;

// interface Params {
//   body?: any;
//   set: any;
// }

// const bancoTesoro = new Elysia({ prefix: "/bt" })
//   .post("/bancos", ({ set }) => fetchBanksController({ set }))
//   .post("/clave", ({ body, set }) => fetchOTPController({ body, set }), {
//     body: t.Object({
//       celularDestino: t.String(),
//     }),
//   })
//   .post("/pago", ({ body, set }) => makePaymentController({ body, set }), {
//     body: t.Object({
//       celular: t.String(),
//       banco: t.String(),
//       cedula: t.String(),
//       monto: t.String(),
//       token: t.String(),
//       nombre: t.String(),
//     }),
//   })
//   .post(
//     "/conformation",
//     ({ body, set }) => makeConformationController({ body, set }),
//     {
//       body: t.Object({
//         referencia: t.String(),
//         monto: t.String(),
//         banco: t.String(),
//         fecha: t.String(),
//         celular: t.String(),
//       }),
//     }
//   );

// export default bancoTesoro;
