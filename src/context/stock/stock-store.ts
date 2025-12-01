
import { Talla } from '@/lib/interfaces/articulo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// export interface Talla {
//   nIdTalla: number;
//   sTalla: string;
//   sSkuHijo: string;
//   sItemName: string;
//   nStockDisponible: number;
//   disponible: boolean;
// }

interface StockStore {
  stockTallas: Talla[] | null;
  nIdArticulo: number | null;
  nIdColor: string | null;
  nIdListaPrecio: number | null;

  setStockTallas: (data: Talla[]) => void;
  setStockInfo: (info: {
    nIdArticulo: number;
    nIdColor: string;
    nIdListaPrecio: number;
  }) => void;

  clearStockTallas: () => void;
}

const useStockStore = create<StockStore>()(
  persist(
    (set) => ({
      stockTallas: null,
      nIdArticulo: null,
      nIdColor: null,
      nIdListaPrecio: null,

      setStockTallas: (data) => set({ stockTallas: data }),

      setStockInfo: ({ nIdArticulo, nIdColor, nIdListaPrecio }) =>
        set({ nIdArticulo, nIdColor, nIdListaPrecio }),

      clearStockTallas: () =>
        set({
          stockTallas: null,
          nIdArticulo: null,
          nIdColor: null,
          nIdListaPrecio: null,
        }),
    }),
    {
      name: 'stock-store',
     
    }
  )
);

export default useStockStore;
