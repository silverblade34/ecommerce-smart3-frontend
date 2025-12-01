"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import useSidebarStore from "@/context/navigation/sidebar";
import Navigation from "./Navigation";
import { useSession } from "next-auth/react";

const SidebarMobile = () => {
  const { mobile, setMobile } = useSidebarStore();
  const { data: session, status } = useSession();

  const closeModalCart = () => {
    setMobile(false);
  };

  
  return (
    <Transition show={mobile}>
      <Dialog className="relative z-[200]" onClose={closeModalCart}>
        <TransitionChild
          enter="ease-in-out duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary2_sokso  bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="absolute inset-0">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-[80%] bg-surface">
                  {" "}
                  {/* Ocupa 80% de la pantalla */}
                  <div className="flex h-full flex-col rounded-3xl">
                    <div className="flex-1">
                      {status === "authenticated" && (
                        <Navigation
                          desktopSidebarOpen={mobile}
                          navigation={session?.user.vistas}
                          closeSidebar={closeModalCart}
                        />
                      )}
                    </div>

                    <footer className="footer-modal"></footer>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidebarMobile;
