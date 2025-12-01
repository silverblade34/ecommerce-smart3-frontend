import {
  useContext,
  useState,
  useTransition,
  useMemo,
  useCallback,
} from "react";
import { GuideSizeContext } from "../hooks/guide-size.context";
import { MessageGuide } from "./MessageGuide";
import { DetalleProducto, Talla } from "@/lib/interfaces/articulo";
import { useRequestStock } from "../hooks/useRequestStock";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { toast } from "react-toastify";
import { getSizeOrderMap } from "@/utils/size-order-last";
import { SectionDevolutions } from "../../devolutions/SectionDevolutions";

type Props = {
  stockTallas: Talla[] | null;
  product: DetalleProducto;
};

const orderMap = getSizeOrderMap();

export const SectionMessages = ({ stockTallas, product }: Props) => {
  const stockTallasFiltered = useMemo(() => {
    const filtered =
      stockTallas?.filter((talla) => talla.nStockDisponible === 0) ?? [];

    return filtered.sort((a, b) => {
      const indexA = orderMap[a.sTalla] ?? Number.MAX_SAFE_INTEGER;
      const indexB = orderMap[b.sTalla] ?? Number.MAX_SAFE_INTEGER;
      return indexA - indexB;
    });
  }, [stockTallas]);

  const { sizeCombined, guideSize } = useContext(GuideSizeContext);
  const { customer, notifyStock, handleSendRequest } = useRequestStock({
    product,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [stateForm, setStateForm] = useState({
    customer: customer || {
      phone: "",
      email: "",
      external_id: "",
      num_doc: "",
      first_name: "",
      last_name: "",
      type_customer: "",
    },
    notifyStock: {
      ...notifyStock,
      notify_via: "",
    },
  });

  // Memoizar validaciones booleanas
  const { viewForm } = useMemo(() => {
    const existStockCero =
      stockTallas?.some((talla) => talla.nStockDisponible === 0) || false;
    const hasTallas = stockTallas != null && stockTallas.length > 0;
    const hasCustomer = customer != null;
    const viewForm = existStockCero && hasTallas && hasCustomer;

    return { existStockCero, hasTallas, hasCustomer, viewForm };
  }, [stockTallas, customer]);

  const [isPendingSubmit, startTransition] = useTransition();

  // Memoizar validaciones del formulario
  const isFormValid = useMemo(() => {
    const hasNotifyVia = stateForm.notifyStock.notify_via !== "";
    const hasSize = stateForm.notifyStock.size_value !== "";
    return hasNotifyVia && hasSize;
  }, [stateForm.notifyStock.notify_via, stateForm.notifyStock.size_value]);

  const isContactValid = useMemo(() => {
    if (stateForm.notifyStock.notify_via === "WHATSAPP") {
      return stateForm.customer.phone && stateForm.customer.phone.trim() !== "";
    }
    if (stateForm.notifyStock.notify_via === "EMAIL") {
      return stateForm.customer.email && stateForm.customer.email.trim() !== "";
    }
    return false;
  }, [
    stateForm.notifyStock.notify_via,
    stateForm.customer.phone,
    stateForm.customer.email,
  ]);

  // Callbacks memoizados para handlers
  const handleNotifyViaChange = useCallback((value: string) => {
    setStateForm((prev) => ({
      ...prev,
      notifyStock: {
        ...prev.notifyStock,
        notify_via: value,
      },
    }));
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setStateForm((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        phone: value,
      },
    }));
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setStateForm((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        email: value,
      },
    }));
  }, []);

  const handleSizeChange = useCallback((value: string) => {
    setStateForm((prev) => ({
      ...prev,
      notifyStock: {
        ...prev.notifyStock,
        size_value: value || "",
      },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error("Por favor completa todos los campos del formulario.");
        return;
      }

      if (!isContactValid) {
        toast.error(
          `Por favor ingresa un ${
            stateForm.notifyStock.notify_via === "WHATSAPP"
              ? "número de Whatsapp"
              : "correo electrónico"
          }.`
        );
        return;
      }

      // Buscar la talla seleccionada para obtener el sku_child
      const selectedTalla = stockTallasFiltered.find(
        (talla) =>
          talla.nIdTalla.toString() === stateForm.notifyStock.size_value
      );

      if (!selectedTalla) {
        toast.error("Talla no encontrada.");
        return;
      }

      startTransition(async () => {
        try {
          await handleSendRequest({
            customer: {
              email: stateForm.customer.email,
              external_id: stateForm.customer.external_id,
              num_doc: stateForm.customer.num_doc,
              first_name: stateForm.customer.first_name,
              last_name: stateForm.customer.last_name,
              phone: stateForm.customer.phone,
              type_customer: stateForm.customer.type_customer,
            },
            model_name: stateForm.notifyStock.model_name,
            brand_name: stateForm.notifyStock.brand_name,
            color_name: stateForm.notifyStock.color_name,
            notify_via: stateForm.notifyStock.notify_via,
            size_value: stateForm.notifyStock.size_value!,
            sku_child: selectedTalla.sSkuHijo!,
            code_catalog: stateForm.notifyStock.code_catalog,
          });
          toast.success("Solicitud enviada correctamente.");
          onOpenChange();
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Error desconocido al enviar la solicitud.");
          }
        }
      });
    },
    [
      isFormValid,
      isContactValid,
      stateForm,
      stockTallasFiltered,
      handleSendRequest,
      onOpenChange,
    ]
  );

  return (
    <div>
      {sizeCombined && <MessageGuide messages={sizeCombined.message} />}
      {product && <SectionDevolutions producto={product} canViewDevolutions />}
      {!guideSize && (
        <div className="text-title mt-5 flex flex-col justify-start">
          <a
            href="https://sokso.com/tallas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary underline hover:text-purple normal-case"
          >
            Ver guía de tallas
          </a>
        </div>
      )}
      {viewForm && (
        <div className="mt-4">
          <button
            className="text-secondary underline hover:text-purple normal-case"
            onClick={onOpen}
          >
            ¿No encuentras tu talla? Recibe una notificación.
          </button>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
              <ModalHeader className="flex flex-col justify-center items-center gap-2">
                <h2 className="text-primary_sokso text-2xl font-bold flex items-center gap-2">
                  <span role="img" aria-label="bell">
                    🔔
                  </span>
                  Notificame su regreso
                </h2>
              </ModalHeader>
              <ModalBody>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block mb-2 font-medium">
                      Seleccione el medio por el cual desea recibir a
                      notificación
                    </label>
                    <RadioGroup
                      aria-label="Medio de notificación"
                      orientation="horizontal"
                      className="flex justify-center items-center gap-4"
                      value={stateForm.notifyStock.notify_via}
                      isDisabled={isPendingSubmit}
                      onChange={(e) => handleNotifyViaChange(e.target.value)}
                    >
                      <Radio value="WHATSAPP">Whatsapp</Radio>
                      <Radio value="EMAIL">Correo</Radio>
                    </RadioGroup>
                  </div>
                  {stateForm.notifyStock.notify_via === "WHATSAPP" && (
                    <div>
                      <label className="block mb-2 font-medium">
                        Ingresa tu número de celular:
                      </label>
                      <Input
                        type="tel"
                        aria-label="Número de celular"
                        value={stateForm.customer?.phone || ""}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        isDisabled={isPendingSubmit}
                        placeholder="Ingresa tu número de Whatsapp"
                      />
                    </div>
                  )}
                  {stateForm.notifyStock.notify_via === "EMAIL" && (
                    <div>
                      <label className="block mb-2 font-medium">
                        Ingresa tu correo electrónico:
                      </label>
                      <Input
                        type="email"
                        aria-label="Correo electrónico"
                        value={stateForm.customer?.email || ""}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="Ingresa tu correo electrónico"
                        isDisabled={isPendingSubmit}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-primary_sokso font-bold">
                      {product.sDescripcion}
                    </p>
                    <label
                      htmlFor="size-select"
                      className="block mb-2 font-medium"
                    >
                      Selecciona la talla que quieres recibir
                    </label>
                    <Select
                      id="size-select"
                      aria-label="Seleccionar talla"
                      className="mt-2 w-full"
                      value={stateForm.notifyStock.size_value}
                      onChange={(e) => handleSizeChange(e.target.value)}
                      placeholder="Selecciona una talla"
                      isDisabled={isPendingSubmit}
                    >
                      {stockTallasFiltered.map((talla) => (
                        <SelectItem
                          key={talla.nIdTalla}
                          value={talla.nIdTalla.toString()}
                        >
                          {talla.sTalla}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-primary_sokso text-white"
                    type="submit"
                    isLoading={isPendingSubmit}
                  >
                    {isPendingSubmit && <Spinner size="sm" />}
                    Guardar y avisarme
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
};
