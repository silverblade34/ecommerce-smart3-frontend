
'use client';

import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Pagination, Spinner } from '@heroui/react';
import { ArrowLeft, LineVertical, LinkSimple, MagnifyingGlass, MicrosoftExcelLogo, Plus } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { priceFormat } from '@/utils/priceFormat';
import { useDetalleBolsa } from '@/hooks/useTrackingDirectora';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const statusColorMap: {
  [key: string]: "success" | "warning" | "primary" | "secondary";
} = {
  REGULAR: "success",
  CYBER: "warning",
  PREVENTA: "primary",
  GRATIS: "secondary",
};

export default function PedidosSeguimientoDirectoraPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [nombreEstrella, setNombreEstrella] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  const { detalle, loading, error, handleExportToExcel, isloadingExcel } = useDetalleBolsa(
    params.id,
    nombreEstrella,
    currentPage,
    rowsPerPage
  );


  const [resumenPedido, setResumenPedido] = useState<{
    numeroPedido: string;
    cierre_pedido: string;
    tipo: string;
    cantidad: number;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("trackingDetalle");
    if (stored) {
      setResumenPedido(JSON.parse(stored));
    }
  }, []);



  useEffect(() => {
    setNombreEstrella(debouncedSearchValue);
    setCurrentPage(1);
  }, [debouncedSearchValue]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    onPageChange: (page: number) => setCurrentPage(page)
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (detalle) {
      setPagination({
        page: detalle.paginacion.page,
        totalPages: detalle.paginacion.totalPages,
        onPageChange: handlePageChange
      });
    }
  }, [detalle, handlePageChange]);



  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!detalle && !loading) {
    return (
      <div className="flex justify-center items-center h-64">
        No se encontraron datos del pedidosss
      </div>
    );
  }



  const productosPorEstrella = detalle?.productos?.reduce((acc, producto) => {
    const estrellaId = producto.datosEstrella.nIdCliente;
    if (!acc[estrellaId]) {
      acc[estrellaId] = {
        estrella: producto.datosEstrella,
        productos: []
      };
    }
    acc[estrellaId].productos.push(producto);
    return acc;
  }, {} as Record<number, { estrella: typeof detalle.productos[0]['datosEstrella'], productos: typeof detalle.productos }>) ?? {};

  const estrellasOrdenadas = Object.values(productosPorEstrella)
    .sort((a, b) => {
      const apellidoA = a.estrella.sApellidos.toLowerCase();
      const apellidoB = b.estrella.sApellidos.toLowerCase();
      return apellidoA.localeCompare(apellidoB);
    });


  return (
    <div>
      {resumenPedido && (
        <div className="mb-4 grid grid-cols-2 gap-2 p-4 bg-white rounded-lg shadow-sm">
          <div>
            <p className="text-xs font-semibold">N° Pedido:</p>
            <Chip color='secondary' variant='flat'>
              <p className="text-sm">{resumenPedido.numeroPedido}</p>
            </Chip>
          </div>
          <div>
            <p className="text-xs font-semibold">Tipo:</p>
            <Chip
              variant="flat"
              color={statusColorMap[resumenPedido?.tipo?.toUpperCase() || "REGULAR"] || "default"}
              size="sm"
            >
              <p className="text-sm">{resumenPedido?.tipo?.toUpperCase()}</p>{/**== "CYBER" ? "VENTA FLASH" : resumenPedido?.tipo?.toUpperCase() */}
            </Chip>
          </div>
          <div>
            <p className="text-xs font-semibold">Fecha de Corte:</p>
            <p className="text-sm">{resumenPedido.cierre_pedido}</p>
          </div>
          <div>
            <p className="text-xs font-semibold">Cantidad:</p>
            <p className="text-sm">{resumenPedido.cantidad}</p>
          </div>
          {detalle?.datosEnvio?.cantidadDespachada || 0 > 0 && (
            <div>
              <p className="text-xs font-semibold">Cant. despachada:</p>
              <p className="text-sm"> {detalle?.datosEnvio?.cantidadDespachada}</p>
            </div>)}
        </div>
      )}

      <div className='my-3 flex items-center justify-between gap-4 rounded-lg p-2'>
        <Button
          startContent={<ArrowLeft className='h-5 w-5' />}
          className='bg-primary_sokso text-white'
          variant='shadow'
          onPress={() => router.back()}
          size='sm'
        >
          Regresar
        </Button>
        <Button
          startContent={<MicrosoftExcelLogo className='h-5 w-5' />}
          className='text-white'
          color='success'
          variant='shadow'
          onPress={() => handleExportToExcel(resumenPedido?.numeroPedido ?? "N°")}
          size='sm'
          isLoading={isloadingExcel}
        >
          Exportar excel
        </Button>
      </div>

      <Input
        placeholder='Buscar producto...'
        startContent={<MagnifyingGlass className='h-5 w-5 text-gray-500' />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        color='secondary'
        variant='flat'
      />


      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner label="Cargando detalle..." color="secondary" />
          </div>
        ) :
          <div className='my-5'>
            <h2 className=' mb-4 text-base font-semibold text-gray-800'>
              Productos
            </h2>
            <div className="grid grid-cols-1">
              {Object.values(estrellasOrdenadas).map(({ estrella, productos }, index) => (
                <Accordion key={index}>
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

                    title={
                      <div className="rounded-lg border-2 border-primary_sokso p-4 bg-[#e9d7f2] ">
                        <p className="text-center text-md font-semibold text-primary_sokso">{estrella.sApellidos} {estrella.sNombre} </p>
                        {/* <p className="text-xs text-gray-500">{estrella.dni}</p> */}
                        <div className="flex justify-between px-2">
                          <p className="text-xs sm:text-sm font-bold">
                            ({productos.reduce((sum, p) => sum + p.cantidad, 0)} unidades)
                          </p>
                          <p className="text-xs sm:text-sm font-bold">
                            S/.  {productos.reduce((acc, p) => acc + Number(p.total), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    }
                    className="bg-transparent rounded-lg mb-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">

                      {productos.map((producto, i) => (

                        <li
                          key={producto.id}
                          className="relative flex flex-col mr-8 rounded-lg bg-white p-2 mt-2 text-center shadow transition-shadow duration-300 ease-in-out hover:shadow-lg"
                        >
                          <div>
                            <Link
                              prefetch={false}
                              href={`/articulos/detalle/${producto.datosItem.urlEcommerce}`}
                              className="absolute left-2 top-2 cursor-pointer rounded-full border border-primary_sokso bg-primary_sokso p-1 text-white hover:bg-primary_sokso"
                            >
                              <LinkSimple size={15} />
                            </Link>
                            {/* <p className='text-xs mb-2'>{estrella.sNombre} {' '} {estrella.sApellidos}</p> */}
                          </div>

                          <div className='flex h-full items-center  justify-between space-x-2 lg:flex-col lg:items-end lg:space-x-0'>
                            <Image
                              alt={producto.datosItem.descripcion}
                              src={producto.datosItem.imagen || "/images/imagen-no-disponible.jpg"}
                              width={70}
                              height={70}
                              className='mx-auto rounded-full object-cover '
                            />

                            <div className="flex h-full w-full flex-col justify-between">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {producto.datosItem.descripcion}
                              </h3>

                              <div className="grid grid-cols-3">
                                <div className="col-span-3 flex flex-col items-start justify-center border-t border-line px-2 py-1">
                                  <p className="text-wrap text-xs font-medium capitalize text-gray-800">
                                    F. Pedido {dayjs(producto.fecha).utc().format('DD/MM/YYYY HH:mm')}
                                  </p>
                                </div>
                                <div className="col-span-2 flex flex-col items-start justify-center border-t border-line px-2 py-1">
                                  <span className="text-xs font-light text-gray-600">Color</span>
                                  <p className="text-wrap text-xs font-medium capitalize text-gray-800">
                                    {producto.datosItem.color}
                                  </p>
                                </div>
                                <div className="col-span-1 flex flex-col items-start justify-center border-l border-t border-line px-2 py-1">
                                  <span className="text-xs font-light text-gray-600">Talla</span>
                                  <span className="text-xs font-medium capitalize text-gray-800">
                                    {producto.datosItem.talla}
                                  </span>
                                </div>
                                <div className="col-span-1 flex flex-col text-center items-center justify-center border-t border-line px-2 py-1">
                                  <span className="text-xs font-light text-gray-600">Cant. Pedido</span>
                                  <span className="text-xs  font-medium text-gray-800">
                                    {producto.cantidad}
                                  </span>
                                </div>

                                <div className="col-span-1 flex flex-col text-center items-center justify-center border-t border-line px-2 py-1">
                                  <span className="text-xs font-light text-gray-600">Cant. Despachada</span>
                                  <span className="text-xs  font-medium text-gray-800">
                                    {producto.cantidadDespachada || 0}
                                  </span>
                                </div>

                                <div className="col-span-1 flex flex-col justify-center border-t border-line pl-3 py-1 text-center items-center">
                                  <span className="text-xs font-light text-gray-600 ">Total</span>
                                  <span className="text-xs font-medium capitalize text-gray-800 text-center">
                                    {priceFormat(producto.total)}
                                  </span>
                                </div>
                                <div className="col-span-3 flex flex-col items-start justify-start  p-2">
                                  <span className="text-xs font-light text-gray-600">F. Confirmación</span>
                                  <span className="text-xs font-medium capitalize text-gray-800">
                                    {producto.fecha && dayjs(producto.fechaAccion).utc().format("DD/MM HH:mm")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                      ))}
                    </div>
                  </AccordionItem>
                </Accordion>
              ))}

            </div>

          </div>
        }
      </div>

      {/* <div className='flex w-full justify-center pb-8'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={pagination.page}
          total={pagination.totalPages}
          onChange={pagination.onPageChange}
        />
      </div> */}


    </div>
  );
}