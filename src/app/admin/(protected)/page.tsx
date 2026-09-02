import { AdminDashboard } from "@/components/admin/AdminDashboard/AdminDashboard";
import { adminDashboardService } from "@/server/services/adminDashboardService";
import { requireAdminUser } from "@/server/services/sessionService";

export default async function AdminPage() {
  const user = await requireAdminUser();
  const dashboard = await adminDashboardService.getDashboard(user.role);
  return <AdminDashboard user={user} dashboard={dashboard} />;
}
