export interface ResponseGuideSize {
  matrix: SizeGuideEcommerceResponse;
}
/** Texto que puede estar en negrita o no dentro del mensaje */
export interface SizeMessageText {
  text: string;
  bold: boolean;
}

/** Estructura general de un mensaje de talla */
export interface SizeMessage {
  size_guide_id: number;
  size_value: string;
  message: SizeMessageText[];
}

/** Resultado de la función SQL get_size_guide_combined */
export interface SizeMessagesCombined {
  id: number;
  code_name: string;
  gender: string;
  size_system: string;
  sizes_combined: SizeMessage[];
}

/** ---- Tipos de plantillas posibles ---- */

/**
 *        "id": 1,
            "size_guide_id": 5,
            "size_value": "M",
            "pe_size_id": "M-PE",
            "shoulder_width": "45cm",
            "chest_circumference": "96cm",
            "waist_circumference": "84cm",
            "hip_circumference": "100cm",
            "thigh_circumference": "58cm",
            "height_person": "170cm",
            "order_item": 1
 */

export interface ITemplateRopa {
  id: number;
  size_value: string;
  shoulder_width: string | null;
  chest_circumference: string | null;
  waist_circumference: string | null;
  hip_circumference: string | null;
  thigh_circumference: string | null;
  height_person: string | null;
  order_item: number;
}

export interface ITemplateCalzado {
  id: string;
  order_item: number;
  size: string;
  equivalent_size: string | null;
  eu_size: string | null;
  usa_size: string | null;
  br_size: string | null;
  cm_size: string;
}

/** Guía de tallas para ropa */
export interface SizeGuideRopa {
  sizeMessages: SizeMessagesCombined;
  type: "ropa";
  templateGuide: ITemplateRopa[];
}

/** Guía de tallas para calzado*/
export interface SizeGuideCalzado {
  sizeMessages: SizeMessagesCombined;
  type: "calzado";
  templateGuide: ITemplateCalzado[];
}

/** ---- Unión de todos los posibles retornos ---- */
export type SizeGuideEcommerceResponse = SizeGuideRopa | SizeGuideCalzado;
