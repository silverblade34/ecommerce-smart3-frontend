"use client";
import { useEffect, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { Button, Select, SelectItem } from "@heroui/react";
import { useSearchParams } from 'next/navigation';
import { EnvioDevolucionService, ListAgencyService } from "@/server/actions/devoluciones";
import { ListadoAgencias } from "@/lib/interfaces/devoluciones";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { usePedidosStore } from "@/context/devoluciones/tracking-store";
export default function RegistrarEnvio() {
  const { clearSelectedPedidos } = usePedidosStore();
  const [isLoanding, setLoanding] = useState(false);
  const [agencias, setAgencias] = useState<ListadoAgencias[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [clave, setClave] = useState<string>('');
  const [docEnvio, setDocEnvio] = useState<File | null>(null);
  const [cargaGGRR, setCargaGGRR] = useState<File | null>(null);
  const [doc, setDocumento] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const numero = searchParams.get('numero');
  const cantidad = searchParams.get('cantidad');

  // Agencia seleccionada completa
  const selectedAgency = agencias.find(a => a.id === selectedAgencyId);

  // const handleEnviar = async () => {
  //   if (!id || !selectedAddressId) {
  //     toast.error("Por favor, selecciona una dirección de agencia");
  //     return;
  //   }

  //   if (doc.trim() === "") {
  //     toast.error("Por favor, ingrese el Documento de Envío");
  //     return;
  //   }

  //   if (clave.trim() === "") {
  //     toast.error("Por favor, ingrese la Clave de Envío");
  //     return;
  //   }
  //   try {
  //     setLoanding(true);
  //     const formData = new FormData();
  //     formData.append("sIdBultoCabecera", id);
  //     formData.append("sIdDireccionAgencia", selectedAddressId);
  //     formData.append("sNombreDocumento", doc);
  //     formData.append("sClaveEnvio", clave);

  //     if (docEnvio) {
  //       formData.append("sDocumentoEnvio", docEnvio);
  //     }

  //     if (cargaGGRR) {
  //       formData.append("sGgr", cargaGGRR);
  //     }

  //     const response = await EnvioDevolucionService(formData);
  //     console.log("response", response);

  //     if (response.status === 201 || response.status === 504) {

  //       toast.success(response.message || "Devoluciones enviadas correctamente");
  //       localStorage.removeItem("pedidos-storage");
  //       clearSelectedPedidos()
  //       router.push("/dashboard/devoluciones");
  //     } else {
  //       toast.error(response.message || "Error al enviar las devoluciones");
  //     }
  //     setLoanding(false);
  //   } catch (error) {

  //     console.log("error", error)
  //     toast.error("Hubo un problema al enviar la devolución");
  //   }

  // };


  const handleEnviar = async () => {
    if (!id || !selectedAddressId) {
      toast.error("Por favor, selecciona una dirección de agencia");
      return;
    }

    if (doc.trim() === "") {
      toast.error("Por favor, ingrese el Documento de Envío");
      return;
    }

    if (clave.trim() === "") {
      toast.error("Por favor, ingrese la Clave de Envío");
      return;
    }

    try {
      setLoanding(true);
      const formData = new FormData();
      formData.append("sIdBultoCabecera", id);
      formData.append("sIdDireccionAgencia", selectedAddressId);
      formData.append("sNombreDocumento", doc);
      formData.append("sClaveEnvio", clave);

      if (docEnvio) {
        formData.append("sDocumentoEnvio", docEnvio);
      }

      if (cargaGGRR) {
        formData.append("sGgr", cargaGGRR);
      }

      const response = await EnvioDevolucionService(formData);
      console.log("response", response);

      if (response.success) {
        toast.success(response.message || "Devoluciones procesadas correctamente");
        localStorage.removeItem("pedidos-storage");
        clearSelectedPedidos();
        router.push("/dashboard/devoluciones");
      } else {
        toast.error(response.message || "Error al procesar las devoluciones");
      }

    } catch (error) {
      console.log("error inesperado", error);
      toast.error("Hubo un problema inesperado al enviar la devolución");
    } finally {
      setLoanding(false);
    }
  };

  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        const response = await ListAgencyService();
        if (Array.isArray(response)) {
          setAgencias(response);
        } else {
          setAgencias([response]);
        }
      } catch (error) {
        console.error('Error al obtener agencias:', error);
      }
    };

    fetchAgencias();
  }, []);

  return (
    <><div className="p-6 space-y-6">
      <Button onPress={() => router.back()} className="bg-primary_sokso text-white px-6 py-2">
        ← Volver
      </Button>
    </div><div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-center bg-primary_sokso text-white py-2 rounded-md text-lg font-semibold">
          Registrar Datos de Envío
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">N° Devolución</label>
            <div className="bg-gray-200 p-2 rounded-md text-center font-bold">{numero}</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Cantidad Bultos:</label>
            <div className="bg-gray-200 p-2 rounded-md text-center font-bold">{cantidad}</div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium">Seleccione la Agencia</label>
              <Select
                label="Selecciona una opción"
                value={selectedAgencyId || ""}
                onChange={(e) => setSelectedAgencyId(e.target.value)}
              >
                {agencias.map((agencia) => (
                  <SelectItem key={agencia.id} value={agencia.id}>
                    {agencia.sNombre}
                  </SelectItem>
                ))}
              </Select>
            </div>

          </div>
          <div className="flex justify-between gap-2">

            <div className="w-full">
              <label className="block text-sm font-medium">Dirección de Recogo</label>
              <Select
                label="Selecciona una dirección"
                value={selectedAddressId ?? ""}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                disabled={!selectedAgency}
              >
                {(selectedAgency?.direcciones || []).map((direccion) => {
                  const texto = direccion.sDireccion;
                  return (
                    <SelectItem key={direccion.id} value={direccion.id} textValue={texto}>
                      {texto}
                    </SelectItem>
                  );
                })}
              </Select>


            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Documento de Envío</label>
            <input
              type="text"
              value={doc}
              onChange={(e) => setDocumento(e.target.value)}

              className="w-full p-2 border rounded-md bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium">Documento</label>
            <input
              type="file"
              onChange={(e) => setDocEnvio(e.target.files?.[0] || null)}
              accept=".pdf,image/*"
              className="w-full p-2 border rounded-md" />
            {docEnvio && <Check className="w-6 h-6 text-success mt-1" />}
          </div>
          <div>
            <label className="block text-sm font-medium">Carga la GGRR</label>
            <input
              type="file"
              onChange={(e) => setCargaGGRR(e.target.files?.[0] || null)}
              accept=".pdf,image/*"
              className="w-full p-2 border rounded-md" />
            {cargaGGRR && <Check className="w-6 h-6 text-success mt-1" />}
          </div>
          <div>
            <label className="block text-sm font-medium">Clave Envío </label>
            <input
              type="text"
              value={clave}
              onChange={(e) => setClave(e.target.value)}

              className="w-full p-2 border rounded-md bg-gray-100" />
          </div>
        </div>
        <Button
          isLoading={isLoanding}
          className="mt-4 bg-primary_sokso text-white py-2 rounded-md font-semibold"
          onPress={handleEnviar}
        >
          GUARDAR
        </Button>
      </div></>
  );
}


