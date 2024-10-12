import { t } from "elysia";

export const getClientsDetailsDto = t.Object({
  cedula: t.String(),
});

export const getDebtDto = t.Object({
  cedula: t.String(),
});

export const registerPaymentDto = t.Object({
  IDFactura: t.Number(),
  valor: t.Number(),
  fecha: t.String(),
  secuencial: t.Number(),
});
