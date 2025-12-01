import { listClientesHijosService } from "@/server/actions/client";
import { create } from "zustand";
import { ClientTableResponse } from "@/lib/interfaces/clientes";

interface ClientState {
  loading: boolean;
  clients: ClientTableResponse[];
  setClient: () => void;

  filterClient: (filter: { search: string }) => void;
}
export const useClientStore = create<ClientState>()((set) => ({
  loading: false,
  clients: [],

  setClient: async () => {
    set(() => ({ loading: true }));
    const clientes = await listClientesHijosService("DIR-01");
    set({ clients: clientes });
    set(() => ({ loading: false }));
  },
  filterClient: async (filter) => {
    set(() => ({ loading: true }));
    let clients = await listClientesHijosService("DIR-01");

    if (filter.search) {
      const search_doc_name = filter.search.toLowerCase();
      clients = clients.filter(
        (client) =>
          client.sNumeroDocumento.toLowerCase().includes(search_doc_name) ||
          client.sNombre.toLowerCase().includes(search_doc_name)
      );
    }
    set({ clients });
    set(() => ({ loading: false }));
  },
}));
