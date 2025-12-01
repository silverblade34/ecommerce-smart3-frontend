'use client';

import TableTemplate from '@/components/common/tables/TableTemplate';
import { columnsOrder } from '@/lib/data/tables-data';
import {
  Button,
  Chip,
  getKeyValue,
  Select,
  SelectItem,
  TableCell,
  TableRow
} from '@heroui/react';
import { Plus } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { months, years } from '@/lib/data/default-data';
import { useEffect } from 'react';
import { useOrderStar } from '@/context/orders/order-store';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { OrderStar } from '@/lib/global';

const TablePedidos = () => {

  const { data: session } = useSession();
  const {
    orders,
    loading,
    currentYear,
    currentMonth,
    loadOrderStars,
    setFilters
  } = useOrderStar();

  // console.log("currentMonth",currentMonth)

  const idEstrella = session?.user?.nIdCliente
  const { push } = useRouter();
    useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('catalogoActivo');
      localStorage.removeItem('catalogoFechaFutura');
      localStorage.removeItem('ecommerceFilters');
      console.log('🧹 Se eliminaron CatalogoActivo y catalogoFechaFutura del localStorage');
    }
  }, []);
  useEffect(() => {
    if (idEstrella) {
      loadOrderStars({
        idEstrella,
        nAnio: currentYear,
        nMes: currentMonth
      });
    }
  }, [idEstrella, currentYear, currentMonth, loadOrderStars]);

  const handleYearChange = (year: string) => {
    setFilters({ year: parseInt(year) });
  };

  const handleMonthChange = (month: string) => {
    setFilters({ month: parseInt(month) });
  };
  const raw = typeof window !== "undefined" ? localStorage.getItem("catalog-filter") : null;
  const data = raw ? JSON.parse(raw) : null;

  const hasPreventa = Array.isArray(data?.data)
    ? data.data.some((item: { sDescripcionTipoCatalogo: string, nIdCatalogo: number }) => 
      item.sDescripcionTipoCatalogo.toUpperCase() === "GRATIS" )
    : false;

  const renderCell = useCallback(
    (user: OrderStar, columnKey: string | number) => {
      const cellValue = getKeyValue(user, columnKey);
      switch (columnKey) {
        case 'actions':
          return (
            <Button
              onPress={() => {
                push(`/dashboard/pedidos/estrella/${user.sIdPedidoCabecera}`);
              }}
              type='button'
              color='primary'
              className='bg-primary_sokso'
              size='sm'
            >
              Ver Productos
            </Button>
          );
        case 'cantidad':
          return (
            <div className='text-gray-600'>
              <span > {user.nTotalDespachados} </span> / <span >{user.nTotalPaquetes}</span>
            </div>
          );
        case 'nTotalCompra':
        case 'nGanancia':
          return (
            <div>
              <span className='text-gray-600'>S/.{cellValue}</span>
            </div>
          )
        case 'dFechaApertura':
          return (

            <span className='text-gray-600'>{dayjs(cellValue).format('DD/MM/YYYY')}</span>

          )
        case 'sNumeroPedido':
          return (
            <Chip
              className='capitalize'
              color='warning'
              size='sm'
              variant='flat'
            >
              <span className='text-sm capitalize text-secondary_sokso lg:text-xs'>
                {cellValue}
              </span>
            </Chip>
          );
        default:
          return (
            <span className='text-sm text-gray-900 lg:text-xs'>
              {cellValue}
            </span>
          );
      }
    },
    [push]
  );


  return (
    <div className='pb-2'>

      {hasPreventa && (
        <a href="/articulos?catalogo=preventa">
          <img
            src="/images/gratuito-mobile.png"
            alt="Aviso preventa móvil"
            className="block md:hidden max-w-full h-auto mb-4 mx-auto "
          />
          <img
            src="/images/gratuito-pc.png"
            alt="Aviso preventa web"
            className="hidden md:block max-w-full h-auto mb-4 mx-auto "
          />
        </a>
      )}
      <div className='sm:flex-auto flex items-center mb-2'>
        <p className='font-bold text-lg'>Seguimiento de Pedidos</p>
      </div>

      <div className='w-full justify-between sm:flex sm:items-center'>
        <div className='my-3 mt-4 flex justify-between   sm:mt-2 sm:flex-none gap-2'>
          <Select
            className='w-32'
            // defaultSelectedKeys={[]}
            color='secondary'
            size='sm'
            selectedKeys={[currentYear.toString()]}
            onChange={(e) => handleYearChange(e.target.value)}
          >
            {years.map((year) => (
              <SelectItem key={year.key}>{year.label}</SelectItem>
            ))}
          </Select>
          <Select
            selectedKeys={[String(currentMonth)]}
            onChange={(e) => handleMonthChange(e.target.value)}
            className='w-32'
            color='secondary'
            size='sm'
          >
            {months.map((month) => (
              <SelectItem key={month.key} value={month.key}>{month.label}</SelectItem>
            ))}
          </Select>

        </div>
        <Button
          startContent={<Plus className='h-5 w-5' aria-hidden='true' />}
          onPress={() => push('/articulos')}
          color='primary'
          className=' bg-primary_sokso'
          size='sm'
        >
          Nuevo pedido
        </Button>


      </div>
      <div className='hidden lg:block'>
        <div className="flex justify-between items-center">
          <span className="text-default-500 text-sm">
            Total:{" "}
            <span className="font-medium text-default-700">
              {orders.length}
            </span>{" "}
            pedidos
          </span>
        </div>
        <TableTemplate
          loading={loading}
          data={orders}
          headerColumns={columnsOrder}
          label='Pedidos'
          emptyText='No hay pedidos'
        >
          {(item) => (
            <TableRow key={item.sNumeroPedido}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableTemplate>
      </div>
      <div className='flex flex-col space-y-4 mt-2 lg:hidden'>
        {orders.map((pedido) => (
          <div
            key={pedido.sNumeroPedido}
            className='grid w-full grid-cols-2 gap-y-3 rounded-lg border-t-4 border-line  bg-white p-4 shadow-md lg:px-8'
          >
            <div className='col-span-3 flex items-center justify-between '>
              {renderCell(pedido, 'sNumeroPedido')}
              {renderCell(pedido, 'actions')}
            </div>
            <div className='col-span-3 flex items-center justify-between '>
              <span className='text-xs font-light'>
                {' '}
                Fecha Apertura : {renderCell(pedido, 'dFechaApertura')}
              </span>
            </div>
            <div>
              <span className='text-xs font-light'>Cant.</span>
              {renderCell(pedido, 'cantidad')}
            </div>

            <div>
              <span className='text-xs font-light'>Total</span>
              {renderCell(pedido, 'nTotalCompra')}
            </div>
            <div>
              <span className='text-xs font-light'>Ganancia</span>
              {renderCell(pedido, 'nGanancia')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePedidos;
