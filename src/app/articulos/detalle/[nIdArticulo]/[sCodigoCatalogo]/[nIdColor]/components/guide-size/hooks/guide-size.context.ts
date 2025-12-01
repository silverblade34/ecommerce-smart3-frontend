import { createContext } from "react";
import { SizeGuideEcommerceResponse, SizeMessage } from "../interfaces/responseGuideSize";
import { DetalleProducto } from "@/lib/interfaces/articulo";

interface IGuideSizeContext {
  guideSize: SizeGuideEcommerceResponse | null;
  isLoading: boolean
  error: string | null
  selectSize: (value: string) => void
  sizeCombined: SizeMessage | null | undefined
  product: DetalleProducto
}

export const GuideSizeContext = createContext<IGuideSizeContext>(
  {} as IGuideSizeContext
);
