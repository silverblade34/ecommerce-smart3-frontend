'use client';

import TablePedidosConfirm from '../components/tables/TablePedidosConfirm';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PedidosEstrellaPage() {
  const router = useRouter();

  // 🧹 Borrar localStorage al entrar a esta vista
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('catalogoActivo');
      localStorage.removeItem('catalogoFechaFutura');
      localStorage.removeItem('ecommerceFilters');
      console.log('🧹 Se eliminaron CatalogoActivo y catalogoFechaFutura del localStorage');
    }
  }, []);

  const raw =
    typeof window !== 'undefined'
      ? localStorage.getItem('catalog-filter')
      : null;
  const data = raw ? JSON.parse(raw) : null;

  // 🔹 Validar si existe al menos un GRATUITO
  const hasPreventa = Array.isArray(data?.data)
    ? data.data.some(
        (item: { sDescripcionTipoCatalogo: string; nIdCatalogo: number }) =>
          item.sDescripcionTipoCatalogo.toUpperCase() === 'GRATIS'
      )
    : false;

  return (
    <section>
      {/* Mostrar la imagen solo si hay al menos un GRATUITO */}
      {hasPreventa && (
        <a href="/articulos?catalogo=preventa">
          <img
            src="/images/gratuito-mobile.png"
            alt="Aviso preventa móvil"
            className="block md:hidden max-w-full h-auto mb-4 mx-auto"
          />
          <img
            src="/images/gratuito-pc.png"
            alt="Aviso preventa web"
            className="hidden md:block max-w-full h-auto mb-4 mx-auto"
          />
        </a>
      )}

      <div className="flex justify-between">
        <span className="pb-2 text-xl font-bold text-gray-800">
          Gestión de Pedidos
        </span>
        <Button
          onPress={() => router.push('/articulos')}
          color="primary"
          className="bg-primary_sokso float-right mb-2"
          size="sm"
        >
          <p className="text-xs items-center">+ Nuevo Pedido</p>
        </Button>
      </div>

      <TablePedidosConfirm />
    </section>
  );
}
