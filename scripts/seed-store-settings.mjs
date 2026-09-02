import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
try {
  await prisma.storeSettings.upsert({
    where: { singletonKey: "global" }, update: {},
    create: { singletonKey: "global", storeName: "Aitechz", slogan: "Seu ponto de conexão com o mundo.", whatsapp: "5545998326062", instagram: "gabriel_heidrich", street: "Rua Presidente Juscelino Kubitschek", number: "1015", complement: "Salas 02 e 03", neighborhood: "Coqueiral", city: "Cascavel", state: "PR", zipCode: "85807-440", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Presidente%20Juscelino%20Kubitschek%2C%201015%2C%20Bairro%20Coqueiral%2C%20Cascavel%20-%20PR%2C%2085807-440" },
  });
  console.log("StoreSettings inicializado ou já existente.");
} finally { await prisma.$disconnect(); }
