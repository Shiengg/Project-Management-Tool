import SideBar from "@/components/Layout/SideBar";
import { Metadata } from "next";
import React, { Children } from "react";
import { SidebarProvider } from "@/components/UI/sidebar";

export const metadata: Metadata = {
  title: "Account",
  icons: {
    icon: "/AppLogo.png",
  },
  description: "Project Management Tool",
};
const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1 pl-64">
          <div className="p-4 max-w-[800px] mx-auto">
            <div className="panel-1 p-4 w-full">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
