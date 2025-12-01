import { ResetPass } from "@/components/layout/auth/ResetPasswordModal";
import {
  OptionRestorePassword,
  Validateusername,
} from "@/lib/interfaces/profile";
import {
  changePasswordService,
  sendMessageService,
  validateUser,
  verifyPasswordService,
} from "@/server/actions/users";
import { toast } from "react-toastify";
import { create } from "zustand";

// Custom error type for handling API errors
interface ApiError {
  message: string;
}

interface passwordState {
  search_username: (username: string) => void;
  loading: boolean;
  options: OptionRestorePassword[];
  result: Validateusername | null;
  send_message: (selected: OptionRestorePassword) => void;
  change_password: (data: ResetPass) => Promise<boolean>;
  success: boolean;
  loading_message: boolean;
  reset: () => void;
}

const usePasswrodStore = create<passwordState>((set, get) => ({
  loading: false,
  result: null,
  options: [],
  success: false,
  loading_message: false,

 
  search_username: async (username) => {
    set({ loading: true });
    const res = await validateUser(username);
  
    if (!res.success || !res.data) {
      set({ loading: false });
      toast.error(res.message);
      return;
    }
  
    toast.success('Usuario encontrado');
    const options: OptionRestorePassword[] = [];
  
    if (res.data.sEmail) {
      options.push({
        type: 'email',
        value: res.data.sEmail,
        label: 'Por correo',
      });
    }
  
    if (res.data.sTelefono) {
      options.push({
        type: 'sms',
        value: res.data.sTelefono,
        label: 'Por teléfono',
      });
    }
  
    set({ loading: false, result: res.data, options });
  },

  send_message: async (selected) => {
    set({ loading_message: true });
    const id = get().result?.id;
    if (!id) {
      set({ loading_message: false });
      toast.error('Usuario no encontrado');
      return;
    }
    const payload = {
      id: id,
      medio: selected.type,
    };
    try {
      const res = await sendMessageService(payload);
      console.log("RES", res)
      if(res && res?.success){
         set({ success: true, loading_message: false, result: null, options: [] });
      toast.success(res?.data.message || 'Mensaje enviado');
      }
      
     
    } catch (error) {
      set({ loading_message: false });
      const err = error as ApiError;
      toast.error(err.message);
    }
  },
  reset: () => {
    set({ loading: false, result: null, options: [], success: false });
  },

  change_password: async (data) => {
    set({ loading: true });
    try {
      const payload = {
        id: data.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      console.log("CONTRASENA ANTES", payload)
      const result = await verifyPasswordService(data.currentPassword);
      console.log("CONTRASENA", result)
      if (!result?.data?.vaidate) {
        toast.error(result?.message || 'Contraseña actual incorrecta');
        set({ loading: false });
        return false;
      }
    
      // if (!result) {
      //   set({ loading: false });
      //   // toast.error('Contraseña actual incorrecta');
      //   return false;
      // }

      await changePasswordService(payload);
      set({ loading: false });
      toast.success('Contraseña actualizada');
      return true;
    } catch (error) {
      set({ loading: false });
      const err = error as ApiError;
      toast.error(err.message);
      return false;
    }
  },
}));

export default usePasswrodStore;
