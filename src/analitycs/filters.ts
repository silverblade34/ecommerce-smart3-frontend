import { sendGTMEvent } from "@next/third-parties/google";

// Botón "Ver adelanto exclusivo"
export const handleClickExclusivePreview = () => {
  sendGTMEvent({
    event: "ver_adelanto_exclusivo",
    params: {
      button_id: "btn-ver-adelanto-exclusivo",
      button_name: "Ver adelanto exclusivo",
    },
  });
};

// Botón WhatsApp Sokso
export const handleClickWhatsappSokso = (
  e: React.MouseEvent<HTMLAnchorElement>
) => {
  e.preventDefault();
  console.log("📢 Enviando evento whatsapp_sokso...");

  sendGTMEvent({
    event: "whatsapp_sokso",
    params: {
      button_id: "btn-whatsapp-sokso",
      button_name: "Canal WhatsApp Sokso",
    },
  });

  // Espera 300ms para GA4 y abre el link
  setTimeout(() => {
    window.open(
      "https://www.whatsapp.com/channel/0029Vb6JzlM9MF91cAjiea0w",
      "_blank",
      "noopener,noreferrer"
    );
  }, 300);
};

export const handleClickBannerWhatsappSokso = (
  e: React.MouseEvent<HTMLAnchorElement>
) => {
  e.preventDefault();
  console.log("📢 Enviando evento whatsapp_sokso...");

  sendGTMEvent({
    event: "whatsapp_banner_sokso",
    params: {
      button_id: "link-whatsapp-sokso",
      button_name: "Banner WhatsApp Sokso",
    },
  });

  // Espera 300ms para GA4 y abre el link
  setTimeout(() => {
    window.open(
      "https://www.whatsapp.com/channel/0029Vb6JzlM9MF91cAjiea0w",
      "_blank",
      "noopener,noreferrer"
    );
  }, 300);
};

// type_filter_click|range_filter_click|max_page_filter_click|gender_filter_click|color_filter_click|category_filter_click|brand_filter_click|order_filter_click
