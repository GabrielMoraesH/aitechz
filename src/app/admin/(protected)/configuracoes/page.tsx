import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm/StoreSettingsForm";
import { updateStoreSettingsAction } from "@/server/actions/storeSettingsActions";
import { requireRole } from "@/server/services/sessionService";
import { storeSettingsService, type StoreSettingsInput } from "@/server/services/storeSettingsService";
import styles from "./Settings.module.css";

export default async function SettingsPage() {
  await requireRole(["OWNER"]);
  const settings = await storeSettingsService.get();
  const initialValues: StoreSettingsInput = { storeName: settings.storeName, slogan: settings.slogan ?? "", whatsapp: settings.whatsapp, instagram: settings.instagram ?? "", street: settings.street, number: settings.number, complement: settings.complement ?? "", neighborhood: settings.neighborhood, city: settings.city, state: settings.state, zipCode: settings.zipCode, mapsUrl: settings.mapsUrl ?? "" };
  return <section className={styles.page}><header className={styles.heading}><span>Institucional</span><h1>Configurações da loja</h1><p>Atualize os dados exibidos nos canais públicos da Aitechz.</p></header><StoreSettingsForm initialValues={initialValues} action={updateStoreSettingsAction} /><p className={styles.meta}>Última atualização: {settings.updatedAt.toLocaleString("pt-BR")}{settings.updatedByName ? ` por ${settings.updatedByName}` : ""}</p></section>;
}
