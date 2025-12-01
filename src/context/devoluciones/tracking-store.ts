
import { EnvioList } from '@/lib/interfaces/devoluciones'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


export interface Pedido {
  diaRecojoAprox: string
  recojoEfectivo: string
  fechaAlmacen: string
  fechaRevision: string
  code: string
  fechaApertura: string
  quantity: number
  status: string
  type: string
  estado: string
  images: string[],
  nombre: string,
  fechaRegistro: string,
  facturaOrigen: string,
  motivo: string,
  detalle: string
  urlImagen: string
  precio: number
  cantidad: number
  talla: string
  color: string
  nombreComercial: string
  nombreDirectora: string
}

interface PedidosState {
  selectedPedidos: EnvioList[]
  setSelectedPedidos: (pedidos: EnvioList[]) => void
  addSelectedPedido: (pedido: EnvioList) => void
  removeSelectedPedido: (code: string) => void
  bultos: number
  setBultos: (cantidad: number) => void;
  clearSelectedPedidos: () => void
}

export const usePedidosStore = create<PedidosState>()(
  persist(
    (set) => ({
      selectedPedidos: [],
      bultos: 0,
      setSelectedPedidos: (pedidos) => set({ selectedPedidos: pedidos }),
      addSelectedPedido: (pedido) =>
        set((state) => ({ selectedPedidos: [...state.selectedPedidos, pedido] })),
      removeSelectedPedido: (code) =>
        set((state) => ({
          selectedPedidos: state.selectedPedidos.filter(p => p.sNumeroDevolucion !== (code))
        })),
      setBultos: (cantidad) => set({ bultos: cantidad }), 
       clearSelectedPedidos: () => set({ selectedPedidos: [] })
    }),
    {
      name: "pedidos-storage",
    }
  )
);