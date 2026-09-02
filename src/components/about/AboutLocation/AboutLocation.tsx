import { StoreMap } from "@/components/ui/StoreMap/StoreMap";
import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { formatStoreAddress, type PublicStoreSettings } from "@/lib/storeSettings";
import styles from "./AboutLocation.module.css";
export function AboutLocation({ settings }: { settings: PublicStoreSettings }) { const address = formatStoreAddress(settings); return <section className={styles.section}><Container className={styles.card}><StoreMap settings={settings} className={styles.map} /><div className={styles.content}><p className={styles.eyebrow}>Nossa loja</p><h2 className={styles.title}>Estamos em {settings.city}</h2><p className={styles.description}>Visite a loja física da Aitechz.</p><address className={styles.address}>{address.map((line) => <span key={line}>{line}<br /></span>)}</address>{settings.mapsUrl && <ButtonLink href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir localização da Aitechz no Google Maps">Como chegar</ButtonLink>}</div></Container></section>; }
