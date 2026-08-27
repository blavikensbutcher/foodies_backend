import "dotenv/config";

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const port = Number(process.env.PORT ?? 3000);

const mailgunDomain = getRequiredEnv("MAILGUN_DOMAIN");

export const config = {
  PORT: port,
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  APP_URL: process.env.APP_URL ?? `http://localhost:${port}`,
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
  CLOUDINARY_CLOUD_NAME: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getRequiredEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getRequiredEnv("CLOUDINARY_API_SECRET"),
  MAILGUN_API_KEY: getRequiredEnv("MAILGUN_API_KEY"),
  MAILGUN_DOMAIN: mailgunDomain,
  MAILGUN_FROM: process.env.MAILGUN_FROM ?? `Foodies <no-reply@${mailgunDomain}>`,
} as const;
