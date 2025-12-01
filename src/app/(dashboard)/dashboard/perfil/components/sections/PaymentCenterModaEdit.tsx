import TitleSection from "@/components/common/ui/TitleSection";
import { Checkbox } from "@heroui/react";
import Image from "next/image";

const PaymentCenterModaEdit = () => {
  return (
    <div className="border-b-2 border-secondary2_sokso  pb-4">
      <TitleSection text=" Medios de Pago" />
      <div className=" ">
        <span className=" p-2 text-sm font-semibold uppercase ">
          Aplicativo
        </span>
        <div className="flex  space-x-5 pb-4">
          <div className="my-2 flex space-x-5">
            <Checkbox
              defaultSelected
              className="rounded-lg border border-secondary2_sokso/40"
            >
              <Image
                src="/images/yape.png"
                alt="yape logo"
                width={50}
                height={50}
              />
            </Checkbox>
            <Checkbox
              defaultSelected
              className="rounded-lg border border-secondary2_sokso/40"
            >
              <Image
                src="/images/plin.png"
                alt="plin logo"
                width={50}
                height={50}
              />
            </Checkbox>
          </div>
        </div>
      </div>
      <div>
        <span className=" p-2 text-sm font-semibold uppercase ">
          Transferencia
        </span>
        <div className="flex  space-x-5 pb-4">
          <p className="rounded-md bg-[#B848CA] px-5  py-2 text-white">BCP</p>
          <p className="rounded-md bg-[#B848CA] px-5  py-2 text-white">
            INTERBANK
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCenterModaEdit;
