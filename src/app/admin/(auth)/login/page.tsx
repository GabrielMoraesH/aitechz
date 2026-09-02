import Image from "next/image";
import { redirect } from "next/navigation";

import { loginAction } from "@/server/actions/authActions";
import { getCurrentSession } from "@/server/services/sessionService";

import styles from "./Login.module.css";

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getCurrentSession()) redirect("/admin");
  const showError = (await searchParams).error === "invalid";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Image src="/brand/logo-horizontal.png" alt="Aitechz" width={190} height={56} priority />
        <div className={styles.heading}>
          <span>Área administrativa</span>
          <h1>Acesse sua conta</h1>
          <p>Entre com suas credenciais para continuar.</p>
        </div>
        {showError && <p className={styles.error} role="alert">Email ou senha inválidos.</p>}
        <form action={loginAction} className={styles.form}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
