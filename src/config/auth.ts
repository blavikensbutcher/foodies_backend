import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

const accessTokenDurationMinutes = Number(
  process.env.ACCESS_TOKEN_DURATION_MINUTES ?? 15
);

const refreshTokenDurationDays = Number(
  process.env.REFRESH_TOKEN_DURATION_DAYS ?? 7
);

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (
  !Number.isFinite(accessTokenDurationMinutes) ||
  accessTokenDurationMinutes <= 0
) {
  throw new Error(
    "ACCESS_TOKEN_DURATION_MINUTES must be a positive number"
  );
}

if (
  !Number.isFinite(refreshTokenDurationDays) ||
  refreshTokenDurationDays <= 0
) {
  throw new Error(
    "REFRESH_TOKEN_DURATION_DAYS must be a positive number"
  );
}

const accessTokenDurationSeconds =
  accessTokenDurationMinutes * 60;

const refreshTokenDurationSeconds =
  refreshTokenDurationDays * 24 * 60 * 60;

export const authConfig = {
  jwtSecret,

  accessTokenExpiresIn: accessTokenDurationSeconds,
  refreshTokenExpiresIn: refreshTokenDurationSeconds,

  sessionDurationMs: refreshTokenDurationSeconds * 1000,
};