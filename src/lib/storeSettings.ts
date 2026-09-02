export type StoreSettingsDTO = {
  storeName: string;
  slogan: string | null;
  whatsapp: string;
  instagram: string | null;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  mapsUrl: string | null;
  updatedAt: Date;
  updatedByName: string | null;
};

export type PublicStoreSettings = Omit<StoreSettingsDTO, "updatedAt" | "updatedByName">;

export const whatsappMessages = {
  general: "Olá, vim pelo site da Aitechz e gostaria de mais informações.",
  tradeIn: "Olá, vim pelo site da Aitechz e quero avaliar meu aparelho para troca.",
  technicalSupport: "Olá, vim pelo site da Aitechz e gostaria de solicitar atendimento para assistência técnica.",
} as const;

export function createWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function createInstagramUrl(username: string) {
  return `https://instagram.com/${username.replace(/^@+/, "")}`;
}

export function formatWhatsApp(phone: string) {
  const national = phone.startsWith("55") ? phone.slice(2) : phone;
  if (national.length === 11) return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
  return phone;
}

export function formatStoreAddress(settings: PublicStoreSettings) {
  return [
    `${settings.street}, ${settings.number}`,
    settings.complement,
    `Bairro ${settings.neighborhood}`,
    `${settings.city} - ${settings.state}`,
    `CEP ${settings.zipCode}`,
  ].filter(Boolean) as string[];
}
