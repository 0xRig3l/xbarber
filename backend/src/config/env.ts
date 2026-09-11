import "dotenv/config";

function getPort(value: string | undefined) {
  const port = Number(value ?? 3334);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT deve ser uma porta válida.");
  }

  return port;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variável de ambiente ${key} é obrigatória.`);
  }

  return value;
}

export const env = {
  port: getPort(process.env.PORT),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  databaseUrl: getRequiredEnv("DATABASE_URL"),
};
