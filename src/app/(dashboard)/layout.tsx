
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import SidebarMobile from "@/components/navigation/SidebarMovile";
import { getMyClient } from "@/server/actions/users";
// import { notFound } from "next/navigation";x

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getMyClient();

  if (!profile) {
    return null;
  }

  return (
    <div className="h-full overflow-hidden bg-[#f0f1f8]">
      <div
        className="mx-auto flex h-full max-w-7xl flex-col"
        style={{
          height: "calc(100vh - 5.1rem)",
          maxHeight: "calc(100vh - 5.1rem)",
        }}
      >
        <Header profile={profile} />
        <div className="flex h-full ">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div className="lg:hidden">
            <SidebarMobile />
          </div>
          <main
            className=" bg-sokso w-full  px-10 py-1 "
            style={{
              height: "calc(100vh - 14.5rem)",
              maxHeight: "calc(100vh - 14.5rem)",
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
