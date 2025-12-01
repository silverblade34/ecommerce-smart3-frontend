"use client";

import { handleClickWhatsappSokso } from "@/analitycs/filters";
import { WhatsappLogo } from "@phosphor-icons/react";

export default function WhatsappButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center space-y-1">
      {/* Texto superior */}
      <div className="bg-gray-600 text-white text-xs font-semibold px-2 py-0.5 rounded-lg shadow-md">
        CANAL OFICIAL
      </div>

    <a
        href="https://www.whatsapp.com/channel/0029Vb6JzlM9MF91cAjiea0w"
        target="_blank"
        rel="noopener noreferrer"
        id="btn-whatsapp-sokso"
        onClick={handleClickWhatsappSokso}
        className="bg-[#25D366] text-white p-1.5 rounded-full shadow-lg hover:bg-[#20ba57] transition transform hover:scale-105"
      >
        <WhatsappLogo size={28} weight="bold" />
      </a>


      {/* Texto inferior */}
      <div className="bg-gray-600 text-white text-xs font-semibold px-2 py-0.5 rounded-lg shadow-md">
        Únete aquí
      </div>
    </div>
  );
}
