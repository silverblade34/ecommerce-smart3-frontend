import { CustomerDTO } from "./customer.dto";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { NotifyStockDTO } from "./notify-stock.dto";
import useAuthStore from "@/context/user/auth-store";

type Props = {
  product: DetalleProducto;
};

export interface DtoRequestStock {
  customer: Customer;
  model_name: string;
  brand_name: string;
  color_name: string;
  notify_via: string;
  size_value: string;
  sku_child: string;
  code_catalog: string;
}

export interface Customer {
  external_id: string;
  num_doc: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  type_customer: string;
}

export const useRequestStock = ({ product }: Props) => {
  const profile = useAuthStore((state) => state.profile);
  const customer = CustomerDTO.fromProfile(profile);
  const notifyStock = NotifyStockDTO.toTransform(product);

  const handleSendRequest = async (dto: DtoRequestStock) => {
    // TODO: Cambiar la URL por la correcta cuando esté disponible
    const API_URL =
      process.env.NEXT_PUBLIC_API_GUIDE_SIZE_URL ||
      "https://api-qas-guia-tallas.sokso.com";
    const baseUrl = `${API_URL}/public-api/request-stock/1`;
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error("Error al enviar la solicitud de notificación de stock");
    }
  };

  return { customer, notifyStock, handleSendRequest };
};
