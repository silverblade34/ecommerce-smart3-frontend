'use client';
import { priceFormat } from '@/utils/priceFormat';
import { Chip, Input, Spinner } from '@heroui/react';
import { LinkSimple, MagnifyingGlass } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePedidosProducts } from '@/hooks/usePedidos';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useEstrellaStore from '@/context/orders/start-store';
import { useDebounce } from 'use-debounce';
import { useSession } from 'next-auth/react';

type Props = {
  idEstrella: number;
  numeroPedido: string;

};
dayjs.extend(utc);

const ListProduct = ({ idEstrella, numeroPedido }: Props) => {


  const { idCliente } = useEstrellaStore();
  const [shouldFetch, setShouldFetch] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [nombreEstrella, setNombreEstrella] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const precioDirCol =
    (isAuthenticated && session?.user?.rol?.sCodigo === "COL-EC-01" || isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01");

  useEffect(() => {
    if (!isNaN(idEstrella)) {
      setShouldFetch(true);
    } else {
      setShouldFetch(false);
    }
  }, [idEstrella]);


  useEffect(() => {
    setNombreEstrella(debouncedSearchValue);
  }, [debouncedSearchValue]);

  const { products, loading, error } = usePedidosProducts(
    idCliente || idEstrella,
    numeroPedido,
    nombreEstrella
  );
  if (!shouldFetch) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Cargando información del usuario..." color="secondary" />
      </div>
    )
  }


  if (error) {
    return <div className="flex justify-center items-center h-64">Error al cargar los productos, intente de nuevo.</div>;
  }

  return (
    <div className='my-5'>
      <h2 className='mb-4 text-base font-semibold text-gray-800'>Productos</h2>
      <div className=''>

        <Input
          placeholder='Buscar producto...'
          startContent={<MagnifyingGlass className='h-5 w-5 text-gray-500' />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          color='secondary'
          variant='flat'
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Cargando productos..." color="secondary" />
        </div>
      ) : (
        <ul
          role='list'
          className='grid grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3 mt-4 '
        >
          {products.map(
            ({
              nCantidad,
              nPrecioEstrella,
              nPrecioDirectora,
              nPrecioSugerido,
              dtFechaPedidoDetalle,
              dtFechaConfirmacion,

              producto: {
                detalles:
                { sColor, sTalla, sUrlEcommerce,
                  sDescripcion,
                  imagenes = [],
                }
              },
              estado: {
                sAccionDirectora,
                dtFechaAccionDirectora,
                sMotivoRechazo
              }

            }) => (
              <li
                key={`${dtFechaConfirmacion}-${crypto.randomUUID()}`}
                className=' relative   flex  flex-col rounded-lg bg-white p-2 text-center shadow transition-shadow duration-300 ease-in-out hover:shadow-lg'
              >
                {(sAccionDirectora == 'RECHAZADO' || sAccionDirectora == 'ELIMINADO') && (
                  <div className=' mb-2 w-full  rounded-t-lg border  border-b-0 border-danger-600 bg-danger-50  lg:hidden'>
                    <p className=' px-4 py-1.5  text-xs font-semibold lowercase text-danger-800'>
                      {sMotivoRechazo}
                    </p>
                  </div>
                )}
                <div className=' flex h-full items-center  justify-between space-x-4  lg:flex-col lg:items-end lg:space-x-0'>
                  <Image
                    alt={sDescripcion}
                    src={imagenes[0]?.sNombreArchivo ? imagenes[0]?.sNombreArchivo : '/images/imagen-no-disponible.jpg'}
                    width={90}
                    height={90}
                    className='mx-auto   rounded-full object-cover '
                  />
                  {(sAccionDirectora === 'RECHAZADO' || sAccionDirectora === 'ELIMINADO') && (
                    <div className='my-1 hidden w-full border-x-2 border-danger-600 bg-danger-50 lg:flex'>
                      <p className='px-4 py-1.5 text-xs font-semibold lowercase text-danger-800'>
                        {sMotivoRechazo}
                      </p>
                    </div>
                  )}
                  <div className=' flex h-full w-full flex-col justify-between '>

                    <div className='flex w-full justify-end pb-2'>
                      <Chip
                        color={
                          sAccionDirectora == 'CONFIRMADO'
                            ? 'success'
                            : sAccionDirectora == 'RECHAZADO' || sAccionDirectora == 'ELIMINADO'
                              ? 'danger'
                              : 'warning'
                        }
                        className='capitalize'
                        size='sm'
                        variant='flat'
                      >
                        <span className='text-xs'>
                          {sAccionDirectora == null
                            ? 'PENDIENTE'
                            : sAccionDirectora}
                        </span>
                      </Chip>
                    </div>

                    <h3 className='text-base font-semibold text-gray-900 '>
                      {sDescripcion}
                    </h3>

                    <div className=' grid grid-cols-2'>
                      <div className='col-span-2 flex flex-col items-start justify-start   p-2'>
                        <span className='text-xs font-light text-gray-600'>
                          Fecha Pedido : {dayjs(dtFechaPedidoDetalle).utc().format('DD/MM HH:mm')}
                        </span>

                      </div>
                      <div className='col-span-1 flex flex-col items-start justify-center  border-t border-line  px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          Color
                        </span>
                        <p className='text-wrap  text-xs font-medium  capitalize text-gray-800'>
                          {sColor}
                        </p>
                      </div>
                      <div className='flex flex-col items-start justify-center border-l border-t border-line px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          Talla
                        </span>
                        <span className='text-xs font-medium  capitalize text-gray-800'>
                          {sTalla}
                        </span>
                      </div>


                      <div className='flex flex-col items-start justify-center  border-t  border-line px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          Precio
                        </span>
                        <span className='text-xs font-medium  capitalize text-gray-800'>
                          {precioDirCol ? priceFormat(nPrecioDirectora) : priceFormat(nPrecioEstrella)}
                        </span>
                      </div>
                      <div className='flex flex-col items-start justify-center  border-t border-line px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          Cantidad
                        </span>
                        <span className='text-xs font-medium  capitalize text-gray-800'>
                          {nCantidad}
                        </span>
                      </div>
                      <div className='flex flex-col items-start justify-center  border-t  border-line px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          Precio Total
                        </span>
                        <span className='text-xs font-medium  capitalize text-gray-800'>
                          {priceFormat(precioDirCol ? Number(nPrecioDirectora) * nCantidad : Number(nPrecioEstrella) * nCantidad)}
                        </span>
                      </div>



                      <div className='flex flex-col items-start justify-center  border-t  border-line px-2 py-1'>
                        <span className='text-xs font-light text-gray-600'>
                          PVS
                        </span>
                        <span className='text-xs font-medium  capitalize text-gray-800'>
                          {priceFormat(nPrecioSugerido)}
                        </span>
                      </div>



                      {dtFechaAccionDirectora && sAccionDirectora == "CONFIRMADO" && (
                        <div className='col-span-2 flex flex-col items-start justify-start  border-l border-t border-line p-2'>
                          <span className='text-xs font-light text-gray-600'>
                            Fecha confirmación
                          </span>
                          <span className='text-xs font-medium capitalize text-gray-800'>
                            {dayjs(dtFechaAccionDirectora).utc().format('DD/MM HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    prefetch={false}
                    href={`/articulos/detalle/${sUrlEcommerce}`}
                    className='absolute left-2 top-2 cursor-pointer rounded-full border border-primary_sokso bg-secondary_sokso/70 p-1 text-white hover:bg-primary_sokso '
                  >
                    <LinkSimple size={24} className=' ' />
                  </Link>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default ListProduct;
