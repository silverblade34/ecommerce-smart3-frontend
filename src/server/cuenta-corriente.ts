"use server";

import { EstadoCuentaResponse, RucCuentaCorriente } from "@/lib/global";
import { http } from "@/utils/http";

export const getEstadoCuentaService = async (
  codCliente: number,
  periodoCont: string,
  year: string
): Promise<EstadoCuentaResponse> => {
  const url = `/api/pedidos/${codCliente}/invoices/${year}/${periodoCont}`;
  const response = await http.get<EstadoCuentaResponse>(url);
  return response.data;
};

export const getCuentaCorrienteRUCService = async (): Promise<RucCuentaCorriente> => {
  const url = `/api/pedidos/cuentaCorrienteDirectoras`;
  const response = await http.get<RucCuentaCorriente>(url);
  return response.data;
};

