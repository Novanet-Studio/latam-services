export interface MakePaymentPayload {
  celular: string;
  banco: string;
  cedula: string;
  monto: string;
  token: string;
  nombre: string;
}

export interface MakeConfirmationPayload {
  referencia: string;
  monto: string;
  banco: string;
  fecha: string;
  celular: string;
}
