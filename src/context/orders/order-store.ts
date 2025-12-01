
import { OrderStar } from "@/lib/global";
import { getOrderStar } from "@/server/actions/pedido";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; 

// interface OrderStar {
//   sNumeroPedido:string
//   nTotalCompra :number
//   nSumaPrecioSugerido:string
//   nTotalPaquetes:number
//   nGanancia:number
//   sFechaApertura :string
//   nTotalDespachados: number
// }

interface OrderStarStore {
  orders: OrderStar[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  productCode: string;
  loadOrderStars: (params: {
    idEstrella: number;
    nAnio?: number;
    nMes?: number;
    sCodigoProducto?: string;
  }) => Promise<void>;
  setFilters: (filters: {
    year?: number;
    month?: number;
    productCode?: string;
  }) => void;
  getOrderByNumber: (numeroPedido: string) => OrderStar | undefined;
}
//    localStorage.removeItem("order-star-store");
export const useOrderStar = create<OrderStarStore>()(
  persist( 
    (set, get) => ({
      orders: [],
      loading: false,
      loaded: false,
      error: null,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth()+1,
      productCode: "",

      loadOrderStars: async ({ idEstrella, nAnio, nMes, sCodigoProducto }) => {
        if (get().loading) return;

        set({ loading: true });
        try {
          const year = nAnio || get().currentYear;
          const month = nMes || get().currentMonth;
          const code = sCodigoProducto || get().productCode;

          const requestParams = {
            idEstrella,
            nAnio: year,
            nMes: month,
            ...(code?.trim() && { sCodigoProducto: code })
          };

          const response = await getOrderStar(requestParams);

          set({ 
            orders: response || [],
            loading: false,
            loaded: true,
            currentYear: year,
            currentMonth: month,
            productCode: code
          });
        } catch (error) {
          console.log(error)
          set({ 
            error: "Error al cargar pedidos",
            loading: false 
          });
        }
      },

      getOrderByNumber: (numeroPedido) => {
        return get().orders.find(order => order.sNumeroPedido === numeroPedido);
      },
      
      setFilters: ({ year, month, productCode }) => {
        set({
          ...(year !== undefined && { currentYear: year }),
          ...(month !== undefined && { currentMonth: month }),
          ...(productCode !== undefined && { productCode })
        });
      }
    }),
    {
      name: "order-star-store", 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        // orders: state.orders,
        currentYear: state.currentYear,
        currentMonth: state.currentMonth,
        // productCode: state.productCode,
        loaded: state.loaded
      })
    }
  )
);