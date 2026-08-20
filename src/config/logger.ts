import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(
  ({ level, message, timestamp, ...meta }: any) => {
    const metaString = Object.keys(meta).length
      ? JSON.stringify(meta)
      : "";
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  },
);

/**
 * Application logger instance
 * @type {winston.Logger}
 *
 * @example
 * // Info level logging
 * logger.info("User logged in", { userId: 123 });
 *
 * @example
 * // Error level logging
 * logger.error("Failed to save user", { error: err });
 *
 * @example
 * // Warning level logging
 * logger.warn("Database connection slow", { duration: 5000 });
 *
 * @example
 * // Debug level logging
 * logger.debug("Processing request", { method: "GET", path: "/api/users" });
 *
 * @method info - Log info level messages
 * @method error - Log error level messages
 * @method warn - Log warning level messages
 * @method debug - Log debug level messages
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat,
  ),
  transports: [new winston.transports.Console()],
});
