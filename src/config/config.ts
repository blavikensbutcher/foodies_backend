import "dotenv/config";
import path from "node:path";

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const port = Number(process.env.PORT ?? 3000);

export const config = {
  PORT: port,
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  APP_URL: process.env.APP_URL ?? `http://localhost:${port}`,
  CLOUDINARY_CLOUD_NAME: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getRequiredEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getRequiredEnv("CLOUDINARY_API_SECRET"),
  SEED_DATA_DIR: process.env.SEED_DATA_DIR ?? path.resolve(process.cwd(), "prisma/seed-data"),
} as const;
