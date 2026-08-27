export function passwordResetEmailTemplate(data: {
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const { name, resetUrl, expiresInMinutes } = data;

  const subject = "Reset your Foodies password";

  const text = [
    `Hi ${name},`,
    "",
    "We received a request to reset the password for your Foodies account.",
    `Open the link below to choose a new password. This link expires in ${expiresInMinutes} minutes.`,
    "",
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email — your password will stay the same.",
    "",
    "— The Foodies team",
  ].join("\n");

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 24px;font-size:20px;color:#111111;">Foodies</h1>
                <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#333333;">Hi ${escapeHtml(name)},</p>
                <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#333333;">
                  We received a request to reset the password for your Foodies account.
                  Click the button below to choose a new password. This link expires in ${expiresInMinutes} minutes.
                </p>
                <p style="margin:0 0 24px;">
                  <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#111111;color:#ffffff;text-decoration:none;border-radius:24px;font-size:14px;font-weight:bold;">
                    Reset password
                  </a>
                </p>
                <p style="margin:0 0 16px;font-size:12px;line-height:1.6;color:#777777;">
                  If the button doesn't work, copy and paste this link into your browser:<br/>
                  <a href="${resetUrl}" style="color:#111111;">${resetUrl}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#777777;">
                  If you didn't request this, you can safely ignore this email — your password will stay the same.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
