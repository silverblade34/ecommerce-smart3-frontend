'use client'
import { Accordion, AccordionItem, Button, Divider, Image, Input, Link, useDisclosure }
 from '@heroui/react';
import { ArrowArcLeft, Trash } from '@phosphor-icons/react';
import { useState } from 'react';

import type { Pedido } from '@/context/devoluciones/tracking-store';

// Datos de prueba
const samplePedidos: Pedido[] = [
  {
    code: 'P001',
    nombre: 'Zapatillas Deportivas',
    precio: 150,
    cantidad: 2,
    talla: '42',
    color: 'Negro',
    fechaRegistro: '2025-03-24',
    facturaOrigen: 'F001-123456',
    motivo: 'Defecto de fábrica',
    detalle: 'Despegado en la suela',
    urlImagen: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
    diaRecojoAprox: '',
    recojoEfectivo: '',
    fechaAlmacen: '',
    fechaRevision: '',
    fechaApertura: '',
    quantity: 0,
    status: '',
    type: '',
    estado: '',
    nombreComercial: '',
    nombreDirectora: ''
  },
];

const DetalleDevoluciones = () => {
  const { onOpen } = useDisclosure();
  const [,setPedidoToRemove] = useState<unknown | null>(null);

  const handleDeleteClick = (pedido:Pedido) => {
    setPedidoToRemove(pedido);
    onOpen();
  };

  return (
    <div className="p-10 space-y-4">
      <div className="flex justify-between items-center">
        <Link href='/dashboard/devoluciones'>
          <Button className='bg-primary_sokso text-white'><ArrowArcLeft /> Regresar</Button>
        </Link>
      
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
  <div className="w-full bg-white p-4 rounded-lg shadow text-center">
    {/* Primera fila */}
    <div className="flex justify-center items-center gap-4 mb-2">
      <p className="text-gray-700 font-bold">Devolución Garantía</p>
      <p className="font-bold bg-purple text-white px-4 py-1 rounded-lg">156</p>
    </div>

    {/* Segunda fila */}
    <div className="flex justify-center items-center gap-4">
      <p className="text-gray-700 font-bold">Cantidad</p>
      <p className="font-bold bg-purple text-white px-4 py-1 rounded-lg">1</p>
    </div>
  </div>
</div>
<div className="w-full flex flex-col sm:flex-row justify-center items-center gap-6 mt-4">
  <Button color="success" className="text-white">Descargar Excel</Button>
  <Button className="text-white bg-primary_sokso">Agregar Garantía</Button>
</div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <Input
          label="Búsqueda por DNI / Nombre / Cód. Producto / N° Pedido"
          className="w-full sm:w-1/2"
          size="sm"
        />
      </div>
      
      {samplePedidos.map((pedido) => (
        <Accordion key={pedido.code} className='bg-white rounded-lg' variant="splitted">
          <AccordionItem
            title={
              <div className='flex justify-between'>
                <p className='p-2 text-sm font-bold'>Iris Cuya pillaca
                S/. 425</p>
                
              </div>
            }
          >
            <Divider />
            <div className="flex items-center justify-between p-4">
  {/* Imagen grande */}
  <div className="w-24 h-24">
    <Image alt="Zapato Estela Sokso DL-23" src="https://via.placeholder.com/150" className="w-full h-full object-cover rounded-lg" />
  </div>

  {/* Información del producto */}
  <div className="flex flex-col flex-grow px-4">
    {/* Primera fila con el nombre */}
    <p className="text-sm font-bold">Zapato Estela Sokso DL-23</p>
    
    {/* Segunda fila con los demás datos */}
    <div className="flex flex-wrap text-sm">
      <p className="font-bold mr-4">Precio: <span className="font-normal">S/. 220</span></p>
      <p className="font-bold mr-4">Cant: <span className="font-normal">1</span></p>
      <p className="font-bold mr-4">TL: <span className="font-normal">35</span></p>
      <p className="font-bold">Color: <span className="font-normal">Gris</span></p>
    </div>
  </div>

  {/* Botón de eliminar en la esquina derecha */}
  <div onClick={() => handleDeleteClick(pedido)} className="cursor-pointer">
    <Trash size={20} color="#eb0000" />
  </div>
</div>

          </AccordionItem>
        </Accordion>
      ))}
      
   
    </div>
  );
}

export default DetalleDevoluciones;

