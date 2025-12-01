/**
 *  *"model_name": "Model X",
  "brand_name": "Brand Y",
  "color_name": "Red",
  "notify_via": "email",
  "size_value": "M",
  "sku_child": "SKU12345",
  "code_catalog": "CAT-001"
 */

import { DetalleProducto } from "@/lib/interfaces/articulo";

export class NotifyStockDTO {
  constructor(
    public model_name: string,
    public brand_name: string,
    public color_name: string,
    public code_catalog: string,
    public size_value?: string,
    public sku_child?: string,
    public notify_via?: string
  ) {}

  static toTransform(data: DetalleProducto) {
    return new NotifyStockDTO(
      data.modelo.sDescripcion,
      data.marca.sNombreMarca,
      data.colorSeleccionado.sColorEcommerce,
      data.catalogo.sCodigoCatalogo
    );
  }
}
