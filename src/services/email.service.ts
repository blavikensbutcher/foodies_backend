import { config } from "../config/config";
import { logger } from "../config/logger";

const MAILGUN_API_BASE = "https://api.mailgun.net/v3";

export async function sendEmail(data: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const body = new URLSearchParams({
    from: config.MAILGUN_FROM,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  const response = await fetch(
    `${MAILGUN_API_BASE}/${config.MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${config.MAILGUN_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");

    logger.error("Failed to send email via Mailgun", {
      to: data.to,
      status: response.status,
      body: errorBody,
    });

    throw new Error(`Mailgun request failed with status ${response.status}`);
  }
}
