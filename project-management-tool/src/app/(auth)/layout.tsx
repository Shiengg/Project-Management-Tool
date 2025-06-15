import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
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
  return <div>{children}</div>;
}
