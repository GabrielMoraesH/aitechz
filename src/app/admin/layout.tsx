import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aitechz Admin",
  description: "Área administrativa da Aitechz.",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
