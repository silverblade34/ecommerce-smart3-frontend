"use client";
import React from "react";

import Button from "@/components/common/buttons/Button";
import PointsLoader from "@/components/common/loader/PointsLoader";
import { OptionRestorePassword } from "@/lib/interfaces/profile";
import { Radio, RadioGroup } from "@headlessui/react";
import {
  CheckCircle,
  PaperPlaneTilt,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  name: string;
  options: OptionRestorePassword[];
  send_message: (selected: OptionRestorePassword) => void;
  loading_message: boolean;
  reset: () => void;
};

const SelectOptionPassword = ({
  name,
  options,
  send_message,
  loading_message,
  reset,
}: Props) => {
  const [selected, setSelected] = useState<OptionRestorePassword>(options[0]);
  const sendMessage = () => {
    if (selected) {
      send_message(selected);
    } else {
      toast.error("Selecciona una opción de recuperación");
    }
  };

  return (
    <div className="flex flex-col space-y-7">
      <p className="form-label text-justify !text-[.875rem] text-secondary_sokso">
        Hola {name}, ¿Cómo te gustaría recuperar tu contraseña?
      </p>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        defaultValue={options[0]}
        className="max-w-sm space-y-2"
      >
        {options.map((item) => (
          <Radio
            key={item.type}
            value={item}
            className="group relative flex cursor-pointer rounded-lg bg-primary_sokso/5 px-5 py-4 text-secondary_sokso shadow-md transition focus:outline-none data-[checked]:bg-primary_sokso/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            <div className="flex w-full items-center justify-between">
              <div className="text-sm/6">
                <p className="font-semibold text-secondary_sokso">
                  {item.label}
                </p>
                <div className="flex gap-2 text-secondary_sokso">
                  <div>{item.value}</div>
                </div>
              </div>
              <CheckCircle
                size={32}
                className="size-6 fill-primary_sokso opacity-0 transition group-data-[checked]:opacity-100"
              />

              {/* <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" /> */}
            </div>
          </Radio>
        ))}
      </RadioGroup>
     

      <Button disabled={loading_message} onClick={sendMessage} type="button">
        {loading_message ? (
          <PointsLoader />
        ) : (
          <>
            <span>Enviar</span>
            <PaperPlaneTilt size={20} className="ml-2" />
          </>
        )}
      </Button>
      <button
        onClick={() => reset()}
        type="button"
        className="text-xs text-purple hover:underline"
      >
        volver
      </button>
      <label
        htmlFor="form-text"
        className="form-label max-w-sm text-justify !text-[.875rem] text-secondary_sokso"
      >
        Si no reconoces ninguno de estos datos, contacta a tu representante o
        escríbenos al siguiente whatsapp
      </label>
    <div className="mt-[5px] text-success flex items-center justify-center hover:underline">
  <WhatsappLogo size={20} className="" />
  <a
    href="https://api.whatsapp.com/send/?phone=5117097221&text&type=phone_number&app_absent=0"
    target="_blank"
    rel="noopener noreferrer"
    className="px-2 hover:underline"
  >
    Necesito ayuda
  </a>
</div>

    </div>
  );
};

export default SelectOptionPassword;
