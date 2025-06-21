import Nav from "@/components/Layout/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bello",
  icons: {
    icon: "/AppLogo.png",
  },
  description: "Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Nav>{children}</Nav>;
}
