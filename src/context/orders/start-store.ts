import { centroModaDirectoraService, centroModaEstrellaService } from "@/server/actions/client";
import { getMyClient } from "@/server/actions/users";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface EstrellaState {
  sTipo: string | null;
  idCliente: number | null;
  nIdDirectora: number | null;
  nombreCompletoCliente: string | null;
  idEstrellaSeleccionada: number | null;
  nombreEstrellaSeleccionada: string | null;
  fetchEstrellaData: (idCliente: number) => Promise<void>;
  resetEstrellaData: () => void;
  fetchDirectoraData: (idCliente: number) => Promise<void>;
  resetDirectoraData: () => void;
  fetchColaboradorData: (idCliente: number) => Promise<void>;
  resetColaboradorData: () => void;
  setEstrellaSeleccionada: (idEstrella: number | null, nombreEstrella: string | null) => void;
  sessionInitialized: boolean;
  setSessionInitialized: (value: boolean) => void;
}

const useEstrellaStore = create<EstrellaState>()(
  persist(
    (set) => ({
      sessionInitialized: false,
      setSessionInitialized: (value) => set({ sessionInitialized: value }),
      sTipo: null,
      idCliente: null,
      nIdDirectora: null,
      nombreCompletoCliente: null,
      idEstrellaSeleccionada: null,
      nombreEstrellaSeleccionada: null,
      fetchEstrellaData: async (idCliente) => {
        try {
          const prof = await getMyClient();
          set({
            sTipo: prof?.usuario.rol.sNombre,
            idCliente: idCliente,
            nIdDirectora: prof?.cliente?.interlocutores[0]?.nPadreId,
            nombreCompletoCliente: prof?.cliente.infoCliente.sNombre + " " + prof?.cliente.infoCliente.sApellidos,
            idEstrellaSeleccionada: null,
            nombreEstrellaSeleccionada: null,
            sessionInitialized: true,
          });
        } catch (error) {
          console.error("Error fetching estrella data:", error);
        }
      },
      resetEstrellaData: () => set({
        sTipo: null,
        idCliente: null,
        nIdDirectora: null,
        nombreCompletoCliente: null,
        idEstrellaSeleccionada: null,
        nombreEstrellaSeleccionada: null
      }),
      // fetchDirectoraData: async (idCliente) => {
      //   try {
      //     const prof = await getMyClient();
      //     console.log("prof", prof)
      //     // const response = await centroModaDirectoraService(idCliente);
      //     set({
      //       sTipo: prof?.usuario.rol.sNombre,
      //       idCliente: idCliente,
      //       nIdDirectora: prof?.cliente.nIdCliente,
      //       nombreCompletoCliente: prof?.cliente.infoCliente.sNombre + " " + prof?.cliente.infoCliente.sApellidos,//response.directora.infoPersonal.sNombreCompleto
      //       idEstrellaSeleccionada: null,
      //       nombreEstrellaSeleccionada: null,
      //       sessionInitialized: true,
      //     });

      //   } catch (error) {
      //     console.error("Error fetching estrella data:", error);
      //   }
      // },
      fetchDirectoraData: async (idCliente) => {
        try {
          const prof = await getMyClient();
          // console.log("prof", prof)
          set({
            sTipo: prof?.usuario.rol.sNombre,
            idCliente: idCliente,
            nIdDirectora: prof?.cliente.nIdCliente,
            nombreCompletoCliente: prof?.cliente.infoCliente.sNombre + " " + prof?.cliente.infoCliente.sApellidos,
            idEstrellaSeleccionada: null,
            nombreEstrellaSeleccionada: null,
            sessionInitialized: false,
          });
        } catch (error) {
          console.error("Error fetching directora data:", error);
        }
      },
      resetDirectoraData: () => set({
        sTipo: null,
        idCliente: null,
        nIdDirectora: null,
        nombreCompletoCliente: null,
        idEstrellaSeleccionada: null,
        nombreEstrellaSeleccionada: null
      }),
      // fetchColaboradorData: async (idCliente) => {
      //   try {
      //     // const response = await centroModaEstrellaService(idCliente);
      //     const prof = await getMyClient();
      //     console.log("prof", prof)
      //     set({
      //       sTipo: prof?.usuario.rol.sNombre,
      //       idCliente: idCliente,
      //       nIdDirectora: prof?.cliente?.interlocutores[0]?.nPadreId,
      //       nombreCompletoCliente: prof?.cliente.infoCliente.sNombre + " " + prof?.cliente.infoCliente.sApellidos,
      //       idEstrellaSeleccionada: null,
      //       nombreEstrellaSeleccionada: null,
      //       sessionInitialized: true,
      //     });
      //   } catch (error) {
      //     console.error("Error fetching estrella data:", error);
      //   }
      // },

      fetchColaboradorData: async (idCliente) => {
        try {
          const prof = await getMyClient();
          console.log("prof", prof)
          set({
            sTipo: prof?.usuario.rol.sNombre,
            idCliente: idCliente,
            nIdDirectora: prof?.cliente?.interlocutores[0]?.nPadreId,
            nombreCompletoCliente: prof?.cliente.infoCliente.sNombre + " " + prof?.cliente.infoCliente.sApellidos,
            idEstrellaSeleccionada: null,
            nombreEstrellaSeleccionada: null,
            sessionInitialized: true,
          });
        } catch (error) {
          console.error("Error fetching colaborador data:", error);
        }
      },
      resetColaboradorData: () => set({
        sTipo: null,
        idCliente: null,
        nIdDirectora: null,
        nombreCompletoCliente: null,
        idEstrellaSeleccionada: null,
        nombreEstrellaSeleccionada: null
      }),



      setEstrellaSeleccionada: (idEstrella, nombreEstrella) => set({
        idEstrellaSeleccionada: idEstrella,
        nombreEstrellaSeleccionada: nombreEstrella
      })
    }),
    {
      name: "estrella-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEstrellaStore;