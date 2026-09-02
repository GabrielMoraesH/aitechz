import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { normalizeEmail } from "../src/lib/auth";
import { hasMinimumPasswordLength, MIN_PASSWORD_LENGTH } from "../src/lib/passwordPolicy";
import { hashPassword } from "../src/server/services/passwordService";

class AdminScriptError extends Error {}

async function main(): Promise<void> {
  const name = process.env.ADMIN_NAME?.trim() ?? "";
  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? "");
  const password = process.env.ADMIN_PASSWORD ?? "";
  const connectionString = process.env.DATABASE_URL;

  if (!name || !email || !password || !connectionString) {
    throw new AdminScriptError(
      "Defina ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD e DATABASE_URL antes de executar.",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AdminScriptError("ADMIN_EMAIL deve conter um email válido.");
  }
  if (!hasMinimumPasswordLength(password)) {
    throw new AdminScriptError(`ADMIN_PASSWORD deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      throw new AdminScriptError(
        "Já existe um usuário com esse email. Nenhum dado foi alterado.",
      );
    }

    await db.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: "OWNER",
        active: true,
      },
      select: { id: true },
    });
    console.log("Owner criado com sucesso.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof AdminScriptError
      ? error.message
      : "Não foi possível criar o owner. Verifique a configuração e tente novamente.";

  console.error(message);
  process.exitCode = 1;
});
