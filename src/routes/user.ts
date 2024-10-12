// import { Elysia, t } from "elysia";

// const user = new Elysia({ prefix: "/user" })
//   .post(
//     "/get-client-details",
//     ({ body, set }) => {
//       return getClientsDetailsController({ body, set });
//     },
//     {
//       body: t.Object({
//         cedula: t.String(),
//       }),
//     }
//   )
//   .post(
//     "/consulta-deuda",
//     ({ body, set }) => {
//       return getDebtController({ body, set });
//     },
//     {
//       body: t.Object({
//         cedula: t.String(),
//       }),
//     }
//   )
//   .post(
//     "/registrar-pago",
//     ({ body, set }) => {
//       return registerPaymentController({ body, set });
//     },
//     {
//       body: t.Object({
//         IDFactura: t.Number(),
//         valor: t.Number(),
//         fecha: t.String(),
//         secuencial: t.Number(),
//       }),
//     }
//   );

// export default user;
