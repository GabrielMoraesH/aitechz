import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppToaster } from "@/components/ui/AppToaster/AppToaster";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Aitechz | Tecnologia, Mobilidade e Assistência",
  description: "Celulares, eletrônicos, acessórios, informática, mobilidade elétrica e assistência técnica especializada em Cascavel-PR.",
  icons: { icon: "/brand/favicon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="pt-BR" className={geist.variable} data-scroll-behavior="smooth"><body>{children}<AppToaster /></body></html>;
}
