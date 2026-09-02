import { notFound } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm/UserForm";
import { UserPasswordForm } from "@/components/admin/UserPasswordForm/UserPasswordForm";
import { resetUserPasswordAction, updateUserAction } from "@/server/actions/adminUserActions";
import { requireRole } from "@/server/services/sessionService";
import { userService } from "@/server/services/userService";
import styles from "../../UserEditor.module.css";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["OWNER"]); const { id } = await params; const user = await userService.getForEdit(id); if (!user) notFound();
  return <section className={styles.page}><header className={styles.heading}><span>Usuários</span><h1>Editar usuário</h1><p>Atualize os dados de acesso sem alterar o perfil.</p></header><UserForm initialValues={{ name: user.name, email: user.email, active: user.active }} role={user.role} action={updateUserAction.bind(null, id)} /><UserPasswordForm action={resetUserPasswordAction.bind(null, id)} /></section>;
}
