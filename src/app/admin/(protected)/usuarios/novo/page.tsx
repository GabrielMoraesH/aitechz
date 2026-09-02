import { UserForm } from "@/components/admin/UserForm/UserForm";
import { createEmployeeAction } from "@/server/actions/adminUserActions";
import { requireRole } from "@/server/services/sessionService";
import styles from "../UserEditor.module.css";
export default async function NewUserPage() { await requireRole(["OWNER"]); return <section className={styles.page}><header className={styles.heading}><span>Usuários</span><h1>Novo funcionário</h1><p>Crie um acesso administrativo com perfil de funcionário.</p></header><UserForm create initialValues={{ name: "", email: "", active: true }} action={createEmployeeAction} /></section>; }
