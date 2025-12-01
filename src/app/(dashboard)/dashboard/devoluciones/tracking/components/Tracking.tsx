'use client';
import { Card, CardBody, CardHeader, Button, Chip, Checkbox, Input, Link, Divider, DatePicker } from '@heroui/react';
import { Alarm, MagnifyingGlass, ShareFat } from '@phosphor-icons/react';
import { usePedidosStore } from '@/context/devoluciones/tracking-store';


// Mapeo de colores según el estado del pedido
const statusColorMap: { [key: string]: string } = {
  abierto: 'bg-blue-500 text-white', // Celeste
  enviado: 'bg-yellow text-black', // Amarillo
  recogido: 'bg-success text-white', // Verde
  'no recogido': 'bg-red text-white', // Rojo
  'en almacen': 'bg-pink text-white', // Verde oscuro
  revision: 'bg-cyan-500 text-white', // Dorado
  completado:' bg-purple text-white'
};

// Interfaz para los pedidos
import type { Pedido } from '@/context/devoluciones/tracking-store';


// Datos de prueba con los 6 casos
const pedidos: Pedido[] = [
  {
    code: 'P001', fechaApertura: '2025-03-24', quantity: 10, status: 'abierto', type: 'Cambio', estado: '6 días para cerrar',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P002', fechaApertura: '2025-03-23', quantity: 5, status: 'enviado', type: 'Garantía', estado: 'En proceso',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P003', fechaApertura: '2025-03-22', quantity: 3, status: 'recogido', type: 'Cambio', estado: 'Entregado',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P004', fechaApertura: '2025-03-21', quantity: 7, status: 'no recogido', type: 'Garantía', estado: 'Pendiente',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P005', fechaApertura: '2025-03-20', quantity: 8, status: 'en almacen', type: 'Cambio', estado: 'En stock',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P006', fechaApertura: '2025-03-19', quantity: 6, status: 'revision', type: 'Garantía', estado: 'En evaluación',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
  {
    code: 'P007', fechaApertura: '2025-03-19', quantity: 6, status: 'completado', type: 'Garantía', estado: 'En evaluación',
    images: [],
    nombre: '',
    fechaRegistro: '',
    facturaOrigen: '',
    motivo: '',
    detalle: '',
    urlImagen: '',
    precio: 0,
    cantidad: 0,
    talla: '',
    color: '',
    nombreComercial: '',
    nombreDirectora: '',
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen:'',
    fechaRevision: '',
  },
];

// Componente principal
const CardPedidosConfirm = () => {
  const { selectedPedidos, addSelectedPedido, removeSelectedPedido } = usePedidosStore();

  const handleSelectPedido = (pedido: Pedido) => {
    const isSelected = selectedPedidos.some((p) => p.code === pedido.code);
    if(isSelected) {
      removeSelectedPedido(pedido.code)
    } else {
      addSelectedPedido(pedido)
    }
  };

  return (
    <div className='space-y-4 mb-4'>
      <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center gap-2">
        <Input
          label="Búsqueda por DNI / Nombre / Cód. Producto / N° Pedido"
          className="w-full sm:w-1/2"
          size="sm"
        />
      </div>

      <div className='flex justify-between items-center'>
        <p>Seleccione las devoluciones que desea enviar:</p>
        {selectedPedidos.length > 0 && (
          <Link  href='/dashboard/devoluciones/detalle'>
            <Button className="bg-primary_sokso text-white" size="sm">
              <ShareFat /> Enviar
            </Button>
          </Link>
        )}
      </div>
          {/* Filtro de Fechas */}
          <div className="flex gap-4 items-center">
        <DatePicker
      
    
          label="Desde"
        
          className="w-1/3"
        />
        <DatePicker
     
          label="Hasta"
        
          className="w-1/3"
        />
      </div>
      {pedidos.map((pedido) => (
        <Card key={pedido.code} className='p-4'>
          <CardHeader className='flex justify-between items-center bg-primary_sokso text-white p-2 rounded'>
            <span className='text-sm'>Devolución por {pedido.type}</span>
            
            {/* Estado del pedido */}
            <Chip className={`p-2 rounded bg-gray-200 text-gray-800`} size='sm'>
              <p className='flex text-sm'>
                <Alarm size={16} className='mr-1 mt-1' /> {pedido.estado}
              </p>
            </Chip>

            {/* Checkbox para seleccionar pedido */}
            {pedido.status === 'abierto' && (
              <Checkbox
                isSelected={selectedPedidos.some((p) => p.code === pedido.code)}
                onChange={() => handleSelectPedido(pedido)}
              />
            )}
          </CardHeader>

          <CardBody>
            <div className='flex justify-between items-center gap-2'>
              <p className='text-sm'><strong>N° Pedido:</strong> {pedido.code}</p>
              <Chip className={`capitalize p-2 rounded ${statusColorMap[pedido.status]}`} size='sm'>
                <p className='text-sm'>{pedido.status}</p>
              </Chip>
            </div>

            <div>
              <p className='text-sm'><strong>Fecha Apertura:</strong> {pedido.fechaApertura}</p>
              <p className='text-sm'><strong>Cantidad Registrada:</strong> {pedido.quantity}</p>
            </div>
           
            {pedido.status !== 'abierto' && (
              <>
               <Divider className='mt-1 bg-black'/>
                <div className=' mt-2 '>
                  <p><strong>Día de recojo aprox.:</strong> <span className='bg-gray-200 p-1 rounded'>{pedido.diaRecojoAprox}</span></p>
                </div>
                <div className='  mt-2'>
                  <p><strong>Recojo Efectivo:</strong> <span className='bg-gray-200 p-1 rounded'>{pedido.recojoEfectivo}</span></p>
                </div>
                <div className='  mt-2 '>
                  <p><strong>Fecha en Almacén:</strong> <span className='bg-gray-200 p-1 rounded'>{pedido.fechaAlmacen}</span></p>
                </div>
                <div className='  mt-2 '>
                  <p><strong>Fecha en revisión:</strong> <span className='bg-gray-200 p-1 rounded'>{pedido.fechaRevision}</span></p>
                </div>
              </>
            )}
            <div className='flex justify-end'>
              <Button size='sm' className='bg-primary_sokso text-white'>
                <MagnifyingGlass /> Ver detalle
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CardPedidosConfirm;
