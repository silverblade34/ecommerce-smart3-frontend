
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTrackingByPedido, getTrackingByPedidoDirectora, listPedidoProducts } from '@/server/actions/pedido';
import { ProductStar, ResPedidosDirectora, TrackingResponse } from '@/lib/global';

export const usePedidos = (numeroPedido: string) => {
  const [pedido, setPedido] = useState<TrackingResponse['data'][0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await getTrackingByPedido({ numeroPedido });

        if (response.status === 200 && response.data.length > 0) {
          setPedido(response.data[0]);
        } else {
          throw new Error('No se encontraron datos del pedido');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [numeroPedido]);

  return { pedido, loading, error };
};

export const usePedidosProducts = (idEstrella: number, numeroPedido: string, codProducto: string) => {
  const [products, setProducts] = useState<ProductStar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await listPedidoProducts(idEstrella, numeroPedido, codProducto);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (numeroPedido) {
      loadProducts();
    }
  }, [numeroPedido, codProducto]);

  return { products, loading, error };
};

export const usePedidosDirectora = (
  tipoCatalogo: string,
  estado: string,
  nomEstrella: string,
  page: number = 1,
  limit: number = 10
) => {
  const [pedidos, setPedidos] = useState<ResPedidosDirectora | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("nIdDirectora");
      const savedTipoCatalogo = localStorage.getItem("tipoCatalogo") || tipoCatalogo;
      const savedEstado = localStorage.getItem("estado") || estado;
      const savedNomEstrella = localStorage.getItem("nomEstrella") || nomEstrella;
      const response = await getTrackingByPedidoDirectora(
        Number(stored),
        savedTipoCatalogo,
        savedEstado,
        savedNomEstrella,
        page,
        limit
      );

      if (response.status === 200) {
        setPedidos(response);
      } else {
        throw new Error("No se encontraron datos del pedido");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [tipoCatalogo, estado, nomEstrella, page, limit]);

  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  return { pedidos, loading, error, refetch: fetchData };
};