import {
  Accordion, AccordionItem, Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Select, SelectItem, Spinner, useDisclosure
} from "@heroui/react";
import { LineVertical, Plus, Trash, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useDevoluciones } from "@/hooks/useDevoluciones";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast } from "react-toastify";
import { useDevolution } from "@/hooks/devolutions/useDevolution";
dayjs.extend(utc)


export default function GestionGarantia() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedReason, setSelectedReason] = useState("");
  const { devoluciones, loading, confirmDelete } = useDevoluciones("GARANTIA")
  const [productoToDelete, setProductoToDelete] = useState<string | null>(null);
  const [isLoadingDelete, setLoadingDelete] = useState(false)
  const { devolution, status, registrarBaseDevolucion } = useDevolution({ sTipoDevolucao: "GARANTIA" });

  const reasons = [
    { value: "Se vendió", label: "Se vendió", textValue: "Se vendió" },
    { value: "No lo trajeron", label: "No lo trajeron", textValue: "No lo trajeron" },
    { value: "Otros", label: "Otros", textValue: "Otros" },
  ];

  const handleDelete = (productoId: string) => {
    setProductoToDelete(productoId);
    onOpen();
  }

  const confirmDelete2 = async () => {
    if (!productoToDelete || !selectedReason) {
      toast.error("Seleccione un motivo para eliminar");
      return;
    }
    try {
      setLoadingDelete(true)
      const result = await confirmDelete(
        productoToDelete,
        selectedReason
      );
      if (result) {
        onOpenChange(); // Cierra el modal
        setProductoToDelete(null);
        setSelectedReason("");
        setLoadingDelete(false)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
      setLoadingDelete(false)

    }
  };



  return (
    <div className="pb-2">
      <div className="flex justify-center w-full">
        <Card className="sm:w-1/2">
          {status ?
            <CardBody>
              <div className="flex items-center justify-between gap-x-2 p-2">
                <div>
                  <p className="font-bold text-sm">N° Devolución: </p>
                  <p className="font-bold text-sm">Total de Devoluciones:</p>
                </div>
                <div>
                  {devolution.sNumeroDevolucion != '' ?
                    <p className="text-sm">{devolution.sNumeroDevolucion} </p>
                    :
                    <p className="text-sm text-red font-bold">NO GENERADO </p>
                  }
                  <p className="text-sm">{devolution.nCantidadProductos}</p>
                </div>
              </div>
              {devolution.sNumeroDevolucion == '' && !devolution.cardAviso?.isActive && (
                <div>
                  <Button className="w-full text-white" size="sm"
                    onPress={registrarBaseDevolucion}
                    color="success"
                  >
                    Generar N° de Devolución
                  </Button>
                </div>
              )}
            </CardBody>
            : <p className="p-4 text-gray-400 text-sm text-center"> Hubo un problema, intentar mas tarde.</p>}
        </Card>
      </div>
      {devolution.sNumeroDevolucion != '' && !devolution.cardAviso?.isActive ?
        <Link
          href="/dashboard/devoluciones/garantia/nuevo"
          className="cursor-pointer rounded-lg  bg-primary_sokso p-2 mt-4 text-white "
        >
          <span className="text-xs"> + Nueva Garantia</span>
        </Link>
        : null}

      {(!devolution.cardAviso?.isActive && devoluciones && devoluciones?.length >= 1) && (
        <div className="flex bg-gray-500 rounded-lg text-white sm:text-xs justify-center items-center  mx-2 p-2 mt-4">
          <WarningCircle size={32} color="#f5f5f5" weight="fill" className="mr-2 mt-1 ml-4" />
          <p className="text-sm">Para enviar la devolución, ingresa al  <a href="/dashboard/devoluciones" className="font-bold text-sm">Tracking de Devoluciones</a></p>
        </div>
      )}

      {!devolution.cardAviso?.isActive && (
        <div className="my-2">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner color="secondary" label="Cargando Registros" />
            </div>
          ) : devoluciones && devoluciones.length > 0 ? (
            <Accordion>
              {devoluciones.map((cliente, index) => (
                <AccordionItem
                  key={index}
                  indicator={({ isOpen }) => (
                    <div className="text-primary_sokso">
                      {isOpen ? (
                        <LineVertical size={20} weight="bold" />
                      ) : (
                        <Plus size={20} weight="bold" />
                      )}
                    </div>
                  )}
                  className="bg-transparent rounded-lg mb-1"
                  title={
                    <div className="rounded-lg border-2 border-primary_sokso p-4 bg-[#e9d7f2] text-primary_sokso font-bold">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="w-full text-center sm:w-auto sm:text-left font-bold text-xs mb-2">
                          {cliente.sFullName}
                        </div>
                        <div className="flex justify-between w-full sm:w-auto sm:gap-8 sm:block">
                          <div className="text-center sm:text-left hidden sm:block text-xs">s/. {cliente.totalMonto}</div>
                        </div>
                        <div className="flex justify-between w-full sm:w-auto sm:gap-4">
                          <div className="text-center sm:text-left block sm:hidden px-4 text-xs">s/. {cliente.totalMonto}</div>
                          <div className="text-center sm:text-left px-4 text-xs"> {cliente.cantidadDevoluciones} / {cliente.cantidadAceptada}</div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  {cliente.detalles.map((producto, i) => (
                    <Card key={i} className="mb-4 p-2 mx-2">
                      <CardHeader className="flex justify-between items-start gap-x-2">
                        <div>
                          <h2 className="text-sm font-semibold text-gray-800">
                            {producto.sProducto}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            Origen: {cliente.origen}
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          variant="flat"
                          onPress={() => handleDelete(producto.id)}
                          className="bg-red hover:text-red-800"
                        >
                          <Trash size={22} color="#e8e8e8" />
                        </Button>
                      </CardHeader>

                      <Divider className="my-2" />
                      <CardBody>
                        <div className="flex flex-row items-center">
                          <div className="w-1/8 sm:w-1/3 flex justify-center sm:justify-start mr-1">
                            <Image
                              alt={"Sin imagen disponible"}
                              src={!!producto.urlFotoProducto ? producto.urlFotoProducto: '/images/imagen-no-disponible.jpg' }
                              width={80}
                              height={80}
                              className="mx-auto rounded-full object-cover"
                            />
                          </div>

                          <div className="w-auto sm:w-2/3  grid md:grid-cols-2 sm:flex-row sm:justify-between px-2 ">
                            <p className="text-xs font-bold pb-0.5">
                              N°:  <a className="font-normal">{producto?.sNumeroFactura}</a>
                            </p>
                            <p className="text-xs font-bold pb-0.5">
                              Cantidad: <a className="font-normal">{producto?.nCantidad}</a>
                            </p>

                            <p className="text-xs font-bold pb-0.5">
                              Precio: <a className="font-normal">S/.{producto?.nPrecio}</a>
                            </p>
                            <p className="text-xs font-bold pb-0.5">
                              Precio Total: <a className="font-normal">S/. {Number(producto?.nPrecio) * Number(producto?.nCantidad)}</a>
                            </p>
                            <p className="text-xs font-bold pb-0.5">
                              Talla:{" "} <a className="font-normal">{producto.talla?.replace("TALLA", "") ?? "Sin talla"}</a>
                            </p>
                            <p className="text-xs font-bold pb-0.5">
                              Color: <a className="font-normal">{producto?.color}</a>
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mt-1">
                            F. Registro: {dayjs(producto.fechaRegistroDevolucion).format('DD/MM/YYYY HH:mm')}
                          </p>
                        </div>

                      </CardBody>
                    </Card>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#8d8b8b]">No se encontraron registros de Devoluciones por GARANTIA.</p>
            </div>
          )}
        </div>
      )}

      {devolution.cardAviso?.isActive && (
        <div className="mt-4">
          <Card>
            <CardHeader className="flex justify-center text-xs font-bold">
              FECHA DE APERTURA: {dayjs(devolution.dtFechaApertura).format('DD/MM/YYYY HH:mm')}
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-center text-sm p-1">
                {devolution?.cardAviso?.sTitle}
              </p>
              <p className="text-center text-sm">
                {devolution?.cardAviso?.sDescription}
              </p>
              <p className="text-red text-center text-sm font-bold p-1">
                {devolution?.cardAviso?.sAlert}
              </p>
            </CardBody>
            <CardFooter className="flex justify-center">
              <Link href="/dashboard/devoluciones">
                <Button className="bg-primary_sokso text-white font-bold">
                  Tracking de Devoluciones
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}

      <Modal
        placement='center'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        classNames={{
          base: "border-0",
          header: "border-b pb-4",
          body: "py-6",
          footer: "border-t pt-4",
        }}
      >
        <ModalContent className="m-8">
          <div>
            <ModalHeader><p className="text-sm">Motivo de Eliminación</p></ModalHeader>
            <ModalBody>
              <Select
                size="sm"
                label="Seleccione un motivo"
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {reasons.map((reason) => (
                  <SelectItem
                    key={reason.value}
                    value={reason.textValue}
                    textValue={reason.textValue}
                  >
                    {reason.label}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={confirmDelete2}
                isLoading={isLoadingDelete}
              >
                Eliminar
              </Button>
              <Button color="default" onPress={() => {
                onOpenChange();
                setSelectedReason("");
                setProductoToDelete(null);
              }}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </div>

        </ModalContent>
      </Modal>
    </div>
  );
};
