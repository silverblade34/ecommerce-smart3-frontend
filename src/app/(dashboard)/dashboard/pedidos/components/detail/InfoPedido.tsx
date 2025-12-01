'use client';

type Props = {
  pedido: {
    sNumeroPedido: string;
    nTotalCompra: number;
    nGanancia: number;
    nTotalPaquetes: number;
  };
};

const InfoPedido = ({
  pedido: { 
    sNumeroPedido, 
    nTotalCompra, 
    nGanancia, 
    nTotalPaquetes
  },
}: Props) => {
  return (
    <div className='relative rounded-lg bg-white px-4 py-4 sm:px-6 lg:px-8'>
      <div>
        <div className='flex items-center gap-x-3'>
          <div className='flex-none rounded-full bg-primary_sokso p-1 text-primary_sokso'>
            <div className='h-1 w-1 rounded-full bg-current' />
          </div>
          <h1 className='flex gap-x-3 leading-7'>
            <span className='text-sm font-semibold text-secondary_sokso'>
              {sNumeroPedido}
            </span>
          </h1>
        </div>
        
        <div className='mt-2'>
          <div className='flex flex-col text-center space-y-2 lg:hidden'>
            <div className="flex justify-between">
              <span className='text-sm font-bold'>Ganancia total:</span>
              <span className='text-sm text-gray-600'>S/. {nGanancia.toFixed(2)}</span>
            </div>         
            <div className="flex justify-between">
              <span className='text-sm font-bold'>Precio total:</span>
              <span className='text-sm text-gray-600'>S/. {nTotalCompra.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className='text-sm font-bold'>Cantidad:</span>
              <span className='text-sm text-gray-600'>{nTotalPaquetes} </span>
            </div>
            
          </div>
          
          <div className='hidden grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid lg:grid-cols-3'>
            <div className="flex flex-col">
              <span className='text-sm font-semibold'>Ganancia total:</span>
              <span className='text-gray-600'>S/. {nGanancia.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className='text-sm font-semibold'>Precio total:</span>
              <span className='text-gray-600'>S/. {nTotalCompra.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className='text-sm font-semibold'>Cantidad:</span>
              <span className='text-gray-600'>{nTotalPaquetes} </span>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPedido;