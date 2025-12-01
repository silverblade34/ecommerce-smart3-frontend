
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import InfoPedido from '../../components/detail/InfoPedido';
import ListProduct from '../../components/detail/ListProduct';
import { Button, Spinner } from '@heroui/react';
import { useOrderStar } from '@/context/orders/order-store';
import { useSession } from 'next-auth/react';
import { TrackingEstrella } from '../../components/steps/TrackingEstrella';
import { getOrderStar } from '@/server/actions/pedido';
import { useEffect, useState } from 'react';
import { OrderStar } from '@/lib/global';

export default function PedidosEstrellaDetailPage () {
   const { push } = useRouter();
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { currentMonth,currentYear } = useOrderStar();
  const [isLoading, setIsLoading] = useState(true);

  const idEstrella = Number(session?.user?.nIdCliente);
  const [pedido, setPedido] = useState<OrderStar | null>(null);

  // const pedido = orders.find((pedido) => pedido.sIdPedidoCabecera == params.id);
   useEffect(() => {
    const fetchPedido = async () => {
      if (!idEstrella || !currentMonth || !currentYear) return;

      try {
        const response = await getOrderStar({ idEstrella, nAnio: currentYear, nMes: currentMonth });
        const found = response.find((pedido) => pedido.sIdPedidoCabecera === params.id);
        setPedido(found ?? null);
      } catch (error) {
        console.error('Error fetching pedido:', error);
        setPedido(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
  }, [idEstrella, currentMonth, currentYear, params.id]);

// const pedido = response.find((pedido) => pedido.sIdPedidoCabecera == params.id)


  if (!pedido) {
    if (isLoading) return <div className='flex justify-center items-center'><Spinner color='secondary' size='md' label='Cargando Registros...'></Spinner></div>;
    return notFound();
  }

  return (
    <section>
      <div className='my-4  flex justify-between'>
          <Button className='rounded-lg bg-primary_sokso text-white' size='sm' onPress={() => push('/dashboard/pedidos/estrella')}>
            Retornar
          </Button>
          <Button className='rounded-lg bg-primary_sokso text-white' size='sm' onPress={() => push('/articulos')}>
            + Nuevo Pedido
          </Button>
      </div>

      <InfoPedido pedido={pedido} />
      <TrackingEstrella 
        numeroPedido={params.id} 
      />

      <ListProduct 
        idEstrella={Number(idEstrella)} 
        numeroPedido={params.id} 
        
      />
    </section>
  );
}