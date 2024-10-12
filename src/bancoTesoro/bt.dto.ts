import { t } from "elysia";

export const otpDto = t.Object({
  celularDestino: t.String(),
});

export const paymentDto = t.Object({
  celular: t.String(),
  banco: t.String(),
  cedula: t.String(),
  monto: t.String(),
  token: t.String(),
  nombre: t.String(),
});

export const conformationDto = t.Object({
  referencia: t.String(),
  monto: t.String(),
  banco: t.String(),
  fecha: t.String(),
  celular: t.String(),
});
