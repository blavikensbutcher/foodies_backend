import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
const sessionDurationDays = Number(
  process.env.SESSION_DURATION_DAYS ?? 7
);

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (
  !Number.isFinite(sessionDurationDays) ||
  sessionDurationDays <= 0
) {
  throw new Error(
    "SESSION_DURATION_DAYS must be a positive number"
  );
}

const sessionDurationSeconds =
  sessionDurationDays * 24 * 60 * 60;

export const authConfig = {
  jwtSecret,
  sessionDurationDays,
  jwtExpiresIn: sessionDurationSeconds,
  sessionDurationMs: sessionDurationSeconds * 1000,
};