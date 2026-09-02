import { StoreMap } from "@/components/ui/StoreMap/StoreMap";
import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { formatStoreAddress, type PublicStoreSettings } from "@/lib/storeSettings";
import styles from "./ContactLocation.module.css";
export function ContactLocation({ settings }: { settings: PublicStoreSettings }) { const address = formatStoreAddress(settings); return <section id="localizacao" className={styles.section} aria-labelledby="contact-location-title"><Container className={styles.layout}><div className={styles.content}><p className={styles.eyebrow}>Nossa loja</p><h2 id="contact-location-title" className={styles.title}>Venha nos visitar</h2><address className={styles.address}>{address.map((line) => <span key={line}>{line}<br /></span>)}</address>{settings.mapsUrl && <ButtonLink href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir localização da Aitechz no Google Maps" variant="light">Como chegar</ButtonLink>}</div><StoreMap settings={settings} /></Container></section>; }
