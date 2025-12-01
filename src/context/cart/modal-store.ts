import { create } from "zustand";

interface DuplicateItem {
  sSkuHijo: string;
  sPromotoraId: number;
  message: string;
  nombreProducto: string;
  nombreEstrella: string;
  colorProducto:string
  tallaProducto:string
  fechaPedido:string
}

interface DuplicateResponse {
  message: string;
  duplicados: DuplicateItem[];
}

interface ModalState {
  
  isDuplicadosOpen: boolean;
  duplicateData: DuplicateResponse | null;
  permitirDuplicados: boolean;
  openModal: (data: DuplicateResponse) => void;
  closeModal: () => void;
  allowDuplicates: () => void;
  reset: () => void;
}



export const useModalStore = create<ModalState>((set) => ({
  isDuplicadosOpen: false,
  duplicateData: null,
  permitirDuplicados: false,
  
  openModal: (data) => set({ 
    duplicateData: data,
    permitirDuplicados: false 
  }),
  
  closeModal: () => set({ 
    isDuplicadosOpen: false
  }),
  
  allowDuplicates: () => set({ 
    permitirDuplicados: true,
    isDuplicadosOpen: false 
  }),
  
  reset: () => set({
    isDuplicadosOpen: false,
    duplicateData: null,
    permitirDuplicados: false
  })
}));