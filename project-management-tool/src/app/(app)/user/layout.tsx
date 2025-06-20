import SideBar from "@/components/Layout/SideBar";
import { Metadata } from "next";
import React, { Children } from "react";

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
    <div className="size-full flex flex-col lg:flex-row  gap-4 p-4 justify-center  ">
      <SideBar />
      <div className="panel-1 p-4 w-full max-w-[800px]">{children}</div>
    </div>
  );
};

export default UserLayout;
