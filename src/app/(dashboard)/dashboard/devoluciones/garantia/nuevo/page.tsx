
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Input,
  useDisclosure,
  ModalContent,
  Textarea,
  Spinner,
} from "@heroui/react";
import { WarningCircle, Trash, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { getListMotivosService, postRegistrarCambioService } from "@/server/actions/devoluciones";
import { DatosDev, DatosList } from "@/lib/interfaces/devoluciones";
import { usePedidosFacturados } from "@/hooks/useDevoluciones";
import { useRouter } from 'next/navigation';


const NuevoCambio = () => {

  const { pedidosFacturados, loading, fetchPedido } = usePedidosFacturados("GARANTIA")
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [motivos, setMotivos] = useState<DatosList[]>([]);
  const [filteredDevoluciones, setFilteredDevoluciones] = useState<DatosDev[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<DatosDev | null>(null); // NUEVO
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoadingSave, setLoadingSave] = useState(false)
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 3) {
      toast.warning("Máximo 3 fotos permitidas");
      return;
    }
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const incrementQuantity = () => {
    if (selectedItem) {
      if (quantity < selectedItem.nCantidad) {
        setQuantity((prev) => prev + 1);
      } else {
        const unidadPlural = (cantidad: number) => cantidad == 1 ? 'unidad' : 'unidades';
        toast.warning(`Solo puede registrar hasta ${selectedItem.nCantidad} ${unidadPlural(selectedItem.nCantidad)}.`);
      }
    }
  };

  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSearch = useCallback(() => {
    if (!searchType || !searchValue.trim()) {
      setFilteredDevoluciones(pedidosFacturados);
      return;
    }
    const query = searchValue.trim().toLowerCase();
    const results = pedidosFacturados?.filter((item) => {
      if (searchType === "estrella") {
        const nombre = item.sDatosEstrella?.sNombre?.toLowerCase() || "";
        const apellidos = item.sDatosEstrella?.sApellidos?.toLowerCase() || "";
        const dni = item.sDatosEstrella?.sNumeroDocumento || "";
        return nombre.includes(query) || apellidos.includes(query) || dni.includes(query);
      }
      if (searchType === "producto") {
        const modelo = item.sDatosProducto?.sModelo?.toLowerCase() || "";
        return modelo.includes(query);
      }
      return false;
    });

    setFilteredDevoluciones(results || []);
  }, [searchType, searchValue, pedidosFacturados]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSubmit = async () => {
    if (!JSON.parse(localStorage.getItem("num-devolucion") || '{"state":{"devolution":""}}').state.devolution) {
      return toast.warning("Debe generar un número de devolución");
    }
    if (!selectedItem) return toast.error("Error interno: no se ha seleccionado el producto.");
    if (!selectedReason) return toast.warning("Debe seleccionar un motivo.")
    if (details == "") {
      toast.warning("Ingrese el detalle de la devolución");
      return;
    }
    if (images.length < 3) {
      toast.warning("Debe adjuntar al menos 3 fotos.");
      return;
    }
    const estrellaRaw = localStorage.getItem("estrella-storage");
    let nombreCliente = "";
    if (estrellaRaw) {
      try {
        const parsed = JSON.parse(estrellaRaw);
        nombreCliente = parsed.state?.nombreCompletoCliente || "sistema";
      } catch (error) {
        console.error("Error al parsear estrella-storage:", error);
      }
    }
    const directora = localStorage.getItem("nIdDirectora");
    const payload = {
      sTipoDevolucion: "GARANTIA",
      sNombreCliente: nombreCliente,
      sUsuarioCreacion: nombreCliente,
      sNumeroFactura: selectedItem.pedidoCabecera?.sNumeroFactura ?? "",
      sIdCliente: directora,
      sIdProducto: String(selectedItem.sDatosProducto?.nIdArticulo ?? ""),
      sProducto: selectedItem.sDatosProducto?.sDescripcion,
      nCantidad: quantity,
      sIdMotivoDevolucion: selectedReason,
      sCodigoProducto: selectedItem.sDatosProducto?.sSkuHijo ?? "",
      nPrecioUnitario: Number(selectedItem.nPrecioEstrella ?? 0),
      sComentariosEvaluacion: details,
      sIdPedidoDetalle: selectedItem.sIdPedidoDetalle ?? "",
      sFotoProducto: selectedItem.sDatosProducto?.imagene != null ? selectedItem.sDatosProducto?.imagene : "",
      nIdClienteEstrella: String(selectedItem.sDatosEstrella?.nIdCliente ?? ""),
      sNombreCompletoEstrella: selectedItem.sDatosEstrella?.sNombre + " " + selectedItem.sDatosEstrella?.sApellidos,
      sNumCellularEstrella: selectedItem.sDatosEstrella?.sNumeroCelular ?? "",
      sNumeroDocumentoEstrella: selectedItem.sDatosEstrella?.sNumeroDocumento ?? "",
      sNumeroDevolucion: JSON.parse(localStorage.getItem("num-devolucion") || '')?.state?.devolution,
      dtFechaFactura: selectedItem.pedidoCabecera.dtFechaFactura,
      sDetalleProducto: JSON.stringify({
        sTalla: selectedItem.sDatosProducto?.sTalla,
        sColor: selectedItem.sDatosProducto?.sColor,
      }),
      salesRepId: selectedItem.pedidoCabecera.infoEnvioDirectora.salesRepId,
      transportId: selectedItem.pedidoCabecera.infoEnvioDirectora.transportId,
      emailDirectora: selectedItem.pedidoCabecera.infoEnvioDirectora.emailDirectora,
      entity: selectedItem.pedidoCabecera.infoEnvioDirectora.entity,
      sFacturaId: selectedItem.pedidoCabecera.infoEnvioDirectora.sFacturaId?.toString(),
      articuloIdNetSuite: selectedItem.sDatosProducto.sNetsuiteId,
      sFotos: images,
      nIndiceNetsuite: selectedItem.nIndiceNetsuite?.toString() ?? '1',
      nivelprecio: selectedItem.sDatosProducto.sCodNivelPrecioDir?.toString(),
      sCodigoOrderVenta: selectedItem.pedidoCabecera?.sCodigoOrderVenta?.toString()
    };
    try {
      setLoadingSave(true)
      const response = await postRegistrarCambioService(payload as unknown as Record<string, string>);
      if (!response.success) {
        setLoadingSave(false)
        toast.error(response.message || "Error al registrar la garantia. Intenta nuevamente.");
        return;
      }

      else {
        toast.success("Garantia registrada correctamente.");
        setLoadingSave(false)
        fetchPedido()
        setSelectedReason("");
        setDetails("");
        setQuantity(1);
        setImages([]);
        setSelectedItem(null);
        onOpenChange();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Mensaje:", error.message);
        console.error("ingresó al catch:", error.stack);
      } else {
        console.error("Error desconocido:", error);
      }
      toast.error("Error al registrar la garantía. Intente nuevamente más tarde.");
    }
  };

  const handleRegistrarCambio = async (item: DatosDev) => {
    try {
      const response = await getListMotivosService("GARANTIA");
      setMotivos(response.data);
      setSelectedItem(item);
      setQuantity(1);
      onOpen();
    } catch (error) {
      console.error("Error al llamar al servicio:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason("");
      setDetails("");
      setImages([]);
      setQuantity(1);
    }
  }, [isOpen]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;

    if (value <= 0) {
      toast.warning("Debe ingresar una cantidad válida mayor a 0.");
      setQuantity(1);
    } else if (selectedItem && value > selectedItem.nCantidad) {
      const unidadPlural = (cantidad: number) => cantidad == 1 ? 'unidad' : 'unidades';
      toast.warning(`Solo puede registrar hasta ${selectedItem.nCantidad} ${unidadPlural(selectedItem.nCantidad)}.`);


      setQuantity(selectedItem.nCantidad);
    } else {
      setQuantity(value);
    }
  };

  return (
    <>

      <Button
        startContent={<ArrowLeft className='h-5 w-5' />}
        className='bg-primary_sokso text-white mb-4'
        variant='shadow'
        onPress={() => router.back()}
        size='sm'
      >
        Regresar
      </Button>

      <div className="flex justify-center w-full">
        <div className="w-full sm:w-1/2">
          <Select
            className="justify-center"
            label="Buscar por"
            selectedKeys={searchType ? [searchType] : []}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue("");
            }}
            size="sm"
            color="secondary"
            variant="flat"
          >
            <SelectItem key="estrella" value="estrella">Nombres o DNI Estrella</SelectItem>
            <SelectItem key="producto" value="producto">Código de Producto</SelectItem>
          </Select>
          {searchType && (
            <Input
              className="mt-2"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              color="secondary"
              variant="flat"
            />
          )}
        </div>
      </div>

      <div className="flex bg-primary_sokso rounded-lg text-white sm:text-xs justify-center items-center  px-4 py-2 mt-4">
        <WarningCircle size={32} color="#f5f5f5" weight="fill" className="mr-2 mt-1" />
        <p className="text-sm">Registra aquí los productos CON USO para realizar la <a className="font-bold text-sm">EVALUACIÓN POR GARANTÍA</a></p>
      </div>

      {loading ? (
        <div className="text-center mt-24 text-sm text-gray-500">
          <Spinner label="Cargando Registros" color="secondary"></Spinner>
        </div>
      ) : (filteredDevoluciones || pedidosFacturados)?.length === 0 ? (
        <div className="text-center mt-24 text-sm text-gray-500 ">
          No se encuentraron pedidos para realizar el registro de GARANTIA.
        </div>
      ) : (
        (filteredDevoluciones || pedidosFacturados)?.map((item, index) => (
          <Card key={index} className="m-4 p-4 mx-2">
            <CardHeader className="grid grid-cols-1 items-center">
              <p className="text-xs font-bold">
                {item?.sDatosEstrella?.sNombre} {item?.sDatosEstrella?.sApellidos}
              </p>
              <p className="text-xs font-semibold">
                {item?.sDatosEstrella?.sNumeroDocumento}
              </p>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-xs text-black mb-2 font-semibold">
                {item.sDatosProducto.sDescripcion}
              </p>
              <div className="flex flex-row items-center">
                <div className="w-1/3 sm:w-1/3 flex justify-center sm:justify-start">
                  <Image
                    alt={item.sDatosProducto.sDescripcion}
                    src={
                      item.sDatosProducto.imagene != null
                        ? item.sDatosProducto.imagene
                        : '/images/imagen-no-disponible.jpg'
                    }
                    width={80}
                    height={80}
                    className="mx-auto rounded-full object-cover"
                  />
                </div>

                <div className="w-auto sm:w-2/3  grid md:grid-cols-2 sm:flex-row sm:justify-between px-2 ">
                  <p className="text-xs font-bold pb-0.5">
                    N°:  <a className="font-normal">{item?.pedidoCabecera?.sNumeroFactura}</a>
                  </p>
                  <p className="text-xs font-bold pb-0.5">
                    Cantidad: <a className="font-normal">{item.nCantidad}</a>
                  </p>

                  <p className="text-xs font-bold pb-0.5">
                    Precio: <a className="font-normal">S/.{item.nPrecioEstrella}</a>
                  </p>
                  <p className="text-xs font-bold pb-0.5">
                    Precio Total: <a className="font-normal">S/. {Number(item.nPrecioEstrella) * item.nCantidad}</a>
                  </p>
                  <p className="text-xs font-bold pb-0.5">
                    Talla:{" "} <a className="font-normal">{item.sDatosProducto?.sTalla.replace("TALLA", "") ?? "Sin talla"}</a>
                  </p>
                  <p className="text-xs font-bold pb-0.5">
                    Color: <a className="font-normal">{item.sDatosProducto?.sColor}</a>
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Button
                  size="sm"
                  className="bg-primary_sokso text-white"
                  onPress={() => handleRegistrarCambio(item)}
                >
                  Registrar Garantia
                </Button>
              </div>
            </CardBody>
          </Card>
        ))
      )}

      <Modal
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        classNames={{
          base: "border-0",
          header: "border-b pb-4 px-6",
          body: "px-6",
        }}
      >
        <ModalContent className="mx-8">
          <ModalHeader>Registrar Garantia</ModalHeader>
          <ModalBody>
            <div className="space-y-2 ">
              <Select
                label="Motivo del Garantia"
                onChange={(e) => setSelectedReason(e.target.value)}
                value={selectedReason}
              >
                {motivos.map((reason) => (
                  <SelectItem key={reason.sIdMotivoDevolucion} value={reason.sIdMotivoDevolucion}>
                    {reason.sNombre}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="number"
                label="Cantidad"
                min={1}
                value={quantity.toString()}
                onChange={handleQuantityChange}
                endContent={
                  <div className="flex gap-1">
                    <Button size="sm" isIconOnly onPress={decrementQuantity}>-</Button>
                    <Button size="sm" isIconOnly onPress={incrementQuantity}>+</Button>
                  </div>
                }
              />


              <div className="justify-center items-center">
                <Textarea
                  label="Coloca más detalles de tu devolución"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                />

                <div className="flex space-x-2  justify-center items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button size="sm" color="success" onPress={openFileDialog} className="text-white mt-2">Subir Fotos</Button>
                  <a className="text-gray-500 text-xs mt-2">Adjunta 3 imágenes del producto</a>

                </div>

                {images.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-bl"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </ModalBody>

          <ModalFooter>
            <Button onPress={onOpenChange}>Cancelar</Button>
            <Button onPress={handleSubmit} className="bg-primary_sokso text-white" isLoading={isLoadingSave}>
              Registrar Garantia
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NuevoCambio;
