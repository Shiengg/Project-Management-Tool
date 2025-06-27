import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import "../styles/themes.css";
import ThemeManager from "@/components/theme/ThemeManager";
import Provider from "@/provider/Provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeManager>  
          <Provider>
            {children}
            <Toaster richColors position="bottom-right" />
          </Provider>
        </ThemeManager>
      </body>
    </html>
  );
}
