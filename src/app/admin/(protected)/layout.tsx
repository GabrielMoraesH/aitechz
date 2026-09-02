import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { requireAdminUser } from "@/server/services/sessionService";

export default async function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  const { id, name, email, role } = await requireAdminUser();
  return <AdminShell user={{ id, name, email, role }}>{children}</AdminShell>;
}
