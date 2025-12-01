"use client";
import useSidebarStore from "@/context/navigation/sidebar";
import useAuthStore from "@/context/user/auth-store";
import { Profile } from "@/lib/interfaces/profile";
import { TextIndent, TextOutdent } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  profile: Profile;
};

const Header = ({ profile }: Props) => {
  const { sidebar, setSidebar, mobile, setMobile } = useSidebarStore();
  const { data } = useSession();
  const { setProfile } = useAuthStore();
  const [isIndent, setIsIndent] = useState(true);

  const userRole: string | undefined = data?.user.rol.sCodigo;

  const isDirector = userRole === "DIR-EC-01";

  useEffect(() => {
    setProfile(profile);
  }, [profile, setProfile]);

  useEffect(() => {
    setIsIndent(sidebar);
  }, [sidebar]);

  return (
    <div className="my-5 flex w-full space-x-3 rounded-md  bg-white p-6 lg:space-x-12">
      <div className="flex border-r border-line pr-3 ">
        <motion.button
          onClick={() => {
            setSidebar(!sidebar);
            setIsIndent(!isIndent);
          }}
          className="hidden text-gray-700 lg:block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
     
          <motion.div
            key={isIndent ? "indent" : "outdent"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!isIndent ? <TextIndent size={32} /> : <TextOutdent size={32} />}
          </motion.div>
        </motion.button>
        <motion.button
          onClick={() => {
            setMobile(!mobile);
            setIsIndent(!isIndent);
          }}
          className="block text-gray-700 lg:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animación de cambio de ícono */}
          <motion.div
            key={isIndent ? "indent" : "outdent"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!isIndent ? <TextIndent size={32} /> : <TextOutdent size={32} />}
          </motion.div>
        </motion.button>
      </div>
      <div className="flex space-x-2 gap-2">
        <div className="flex flex-col items-center justify-center">
          <Image
            className="rounded-full bg-secondary2/50 p-2"
            src="/images/isotipo_sokso.png"
            width={65}
            height={65}
            alt="centro moda"
          />
        </div>
        <div className="flex flex-col justify-center">
        {!isDirector && (
          <p className=" text-lg md:text-xl font-bold">
            {profile.cliente.infoCliente.sNombre}{" "}
            {profile.cliente.infoCliente.sApellidos}
          </p>
        )}
          {isDirector && (
          <> 
            <p className="font-bold">
              {profile.cliente?.directora?.centroModa?.sNombreComercial}
            </p>
             <p className="text-sm font-semibold text-gray-500 uppercase">
               {profile.usuario.rol.sNombre}(A) SOKSO
            </p>
          </> 
          )}
            {!isDirector && (
          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold text-gray-500 uppercase">
              {profile.usuario.rol.sNombre} SOKSO
            </p>
        
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Header;
