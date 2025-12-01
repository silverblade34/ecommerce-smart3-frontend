import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
} from "@heroui/react";
import { useContext } from "react";
import { GuideSizeContext } from "../hooks/guide-size.context";
import { CalzadoGuide } from "./CalzadoGuide";
import { GuiaMedidaPie } from "./GuiaMedidaPie";
import { RopaGuide } from "./RopaGuide";
import { X } from "@phosphor-icons/react";

export const ActionGuideSize = () => {
  const { guideSize, isLoading, error, product } = useContext(GuideSizeContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const guiaTallaName = `${guideSize?.sizeMessages.gender} - ${guideSize?.sizeMessages.size_system}`;

  if (isLoading) return <></>;
  if (error) return <></>;
  if (!guideSize) return <></>;

  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p>
            Talla:{" "}
            <span className="font-semibold bg-[#7E2EA21F] px-3 py-1 rounded-full">
              {guiaTallaName}
            </span>
          </p>
        </div>
        <div>
          <button className="underline text-[#22C4FF]" onClick={onOpen}>
            Ver guía de tallas
          </button>
        </div>
      </div>
      {/**
       * "md:max-w-6xl"
       */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className={
          guideSize.type === "calzado" ? "md:max-w-6xl" : "md:max-w-2xl"
        }
        closeButton={
          <Button variant="flat" isIconOnly size="md">
            <X size={20} weight="bold" />
          </Button>
        }
      >
        <ModalContent>
          <ModalHeader className="flex flex-col justify-center items-center gap-2">
            <p className="text-xl">GUIA DE TALLAS</p>
            <span className="bg-[#7E2EA21F] px-3 py-1 rounded-full uppercase">
              {guideSize.sizeMessages.gender} -{" "}
              {`${product.categoria.sDescripcion} ${product.marca.sNombreMarca}`}
            </span>
          </ModalHeader>
          <ModalBody>
            <>
              {guideSize.type === "calzado" && (
                <div className="max-h-[40rem] overflow-y-scroll overflow-x-hidden md:grid md:grid-cols-2 gap-4 px-3">
                  <section className="md:col-span-2 text-center">
                    <p className="font-semibold font-sans text-2xl">
                      ¿Otra talla? ¡Claro que si!
                    </p>
                    <p className="text-lg max-w-md mx-auto">
                      Realiza tu cambio facílmente. Consulta el plazo con tu
                      asesora de ventas.
                    </p>
                  </section>
                  <section className="mt-4 md:mt-0">
                    {guideSize.type === "calzado" && (
                      <CalzadoGuide templateGuide={guideSize.templateGuide} />
                    )}
                  </section>
                  <section>
                    {guideSize.type === "calzado" && <GuiaMedidaPie />}
                  </section>
                </div>
              )}
              {guideSize.type === "ropa" && (
                <div className="max-h-[40rem] overflow-y-scroll overflow-x-hidden">
                  <section>
                    <RopaGuide templateGuide={guideSize.templateGuide} />
                  </section>
                </div>
              )}
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
