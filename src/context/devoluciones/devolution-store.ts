import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface Devolution {
  idDevolucion: number;
  sNumeroDevolucion: string;
  sTipoDevolucion: string;
  nCantidadProductos: number;
}

interface DevolutionStore {
  devolution: string;
  setDevolution: (data: Devolution) => void;
}


export const useDevolutionStore = create<DevolutionStore>()(
persist(
  (set) => ({
  devolution:  '',
  setDevolution: (data) => set({ devolution: data.sNumeroDevolucion }),
})
,{
  name : "num-devolucion"
})
);