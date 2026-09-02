import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container/Container";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { createInstagramUrl, createWhatsAppUrl, formatWhatsApp, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./Footer.module.css";

const columns = [
  { title: "Produtos", links: [["Celulares", "/produtos"], ["Acessórios", "/produtos"], ["Informática", "/produtos"], ["Áudio", "/produtos"], ["Games", "/produtos"], ["Smartwatches", "/produtos"], ["Mobilidade Elétrica", "/mobilidade-eletrica"]] },
  { title: "Institucional", links: [["Sobre nós", "/sobre"], ["Assistência Técnica", "/assistencia"], ["Troque seu aparelho", "/#troca"], ["Ofertas", "/#troca"], ["Localização", "/#contato"], ["Contato", "/contato"]] },
] as const;

export function Footer({ settings }: { settings: PublicStoreSettings }) {
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp, whatsappMessages.general);
  const instagramHandle = settings.instagram ? `@${settings.instagram}` : null;

  return (
    <footer id="sobre" className={styles.footer}>
      <Container className={styles.grid}>
        <div>
          <Image src="/brand/logo-completa.png" alt="Aitechz — Seu ponto de conexão com o mundo" width={578} height={368} className={styles.logo} />
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className={styles.title}>{column.title}</h2>
            <ul className={styles.links}>{column.links.map(([label, href]) => <li key={label}><Link href={href} className={styles.link}>{label}</Link></li>)}</ul>
          </div>
        ))}
        <div>
          <h2 className={styles.title}>Atendimento</h2>
          <ul className={styles.links}>
            <li><Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" className={`${styles.link} ${styles.contactLink}`}><WhatsAppIcon className={styles.contactIcon} /><span>WhatsApp<span className={styles.detail}>{formatWhatsApp(settings.whatsapp)}</span></span></Link></li>
            {settings.instagram && <li><Link href={createInstagramUrl(settings.instagram)} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${instagramHandle} no Instagram`} className={`${styles.link} ${styles.contactLink}`}><InstagramIcon className={styles.contactIcon} /><span>Instagram<span className={styles.detail}>{instagramHandle}</span></span></Link></li>}
            <li><Link href="/assistencia" className={styles.link}>Assistência</Link></li>
          </ul>
        </div>
      </Container>
      <div className={styles.copyright}><Container className={styles.copyrightInner}>© 2026 Aitechz. Todos os direitos reservados.</Container></div>
    </footer>
  );
}
