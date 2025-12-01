"use client";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { getDetailDevolutionBySku } from "@/server/actions/devoluciones";
import { useEffect, useState } from "react";

type Props = {
  canViewDevolutions?: boolean;
  producto: DetalleProducto;
};

export const SectionDevolutions = ({
  canViewDevolutions = false,
  producto,
}: Props) => {
  const [porcentaje, setPorcentaje] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const notView = porcentaje === "0%";

  const textView =
    notView || !porcentaje
      ? "Este producto no tuvo devoluciones"
      : `Solo el ${porcentaje} realizó un cambio de talla.`;

  useEffect(() => {
    const fetchPorcentaje = async () => {
      try {
        setLoading(true);
        const response = await getDetailDevolutionBySku(
          producto.sSkuHijo,
          producto.colorSeleccionado.nIdColor
        );
        setPorcentaje(response.porcentajeDevolucion);
      } catch (error) {
        const errorData = error as Error;
        setError(errorData.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPorcentaje();
  }, []);

  if (!canViewDevolutions) return <></>;
  if (loading) return <></>;
  if (error) return <></>;

  return (
    <section className="mt-1 w-full bg-[#7E2EA21F] p-2 rounded-xl font-semibold text-sm text-gray-700">
      <div className="flex items-center gap-4 bg-white rounded-xl px-2 py-1">
        <img src="/img-devoluciones.svg" alt="" className="w-10 h-10" />
        <span className="text-sm">{textView}</span>
      </div>
    </section>
  );
};
