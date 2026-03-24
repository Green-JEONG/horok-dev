import type { NodemailerConfig } from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { findUserByEmail } from "@/lib/db";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required email environment variable: ${name}`);
  }

  return value;
}

function parseEmailServerPort() {
  const rawPort = process.env.EMAIL_SERVER_PORT?.trim() ?? "465";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid EMAIL_SERVER_PORT: ${rawPort}`);
  }

  return port;
}

export function getSmtpEmailConfig() {
  const port = parseEmailServerPort();

  return {
    from: getRequiredEnv("EMAIL_FROM"),
    server: {
      host: getRequiredEnv("EMAIL_SERVER_HOST"),
      port,
      secure: port === 465,
      auth: {
        user: getRequiredEnv("EMAIL_SERVER_USER"),
        pass: getRequiredEnv("EMAIL_SERVER_PASSWORD"),
      },
    },
    async sendVerificationRequest({
      identifier,
      url,
      provider,
    }: Parameters<NodemailerConfig["sendVerificationRequest"]>[0]) {
      const transport = createTransport(provider.server);
      const host = new URL(url).host;
      const subjectName = await getLoginMailSubjectName(identifier);
      const subject = `[c.horok] ${subjectName} 님 로그인 링크가 준비됐어요!`;
      const text = createLoginEmailText({ url, host });
      const html = createLoginEmailHtml({ identifier, url, host });

      await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject,
        text,
        html,
      });
    },
  };
}

function createLoginEmailText({ url, host }: { url: string; host: string }) {
  return [
    "c.horok 로그인 링크",
    "",
    "호록이가 로그인 링크를 준비했어요.",
    "아래 링크를 눌러 로그인해 주세요.",
    url,
    "",
    "로그인 후에는 프로필 페이지에서 비밀번호를 재설정하는 것을 권장드려요.",
    `이 링크는 ${host}에서만 사용할 수 있습니다.`,
    "요청하지 않았다면 이 메일은 무시하셔도 됩니다.",
  ].join("\n");
}

function createLoginEmailHtml({
  identifier,
  url,
  host,
}: {
  identifier: string;
  url: string;
  host: string;
}) {
  const escapedIdentifier = escapeHtml(identifier);
  const escapedUrl = escapeHtml(url);
  const escapedHost = escapeHtml(host);
  const escapedLogoUrl = getEscapedEmailLogoUrl();
  const fontFamily =
    "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, 'Segoe UI', sans-serif";

  return `
    <html>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }

          @media (prefers-color-scheme: dark) {
            body,
            .email-shell {
              background: linear-gradient(180deg, #7a4b00 0%, #5f3500 52%, #422300 100%) !important;
            }

            .email-brand {
              color: #ffffff !important;
            }

            .email-card {
              background: #171717 !important;
              border-color: #3f3f46 !important;
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.38) !important;
            }

            .email-title,
            .email-strong,
            .email-note-title {
              color: #fafafa !important;
            }

            .email-copy,
            .email-note-copy,
            .email-footer,
            .email-footer strong {
              color: #d4d4d8 !important;
            }

            .email-note {
              background: #27272a !important;
              border-color: #3f3f46 !important;
            }

            .email-link {
              color: #ffb84d !important;
            }

            .email-button-cell,
            .email-button-link {
              background: #ff9a00 !important;
              background-color: #ff9a00 !important;
              background-image: linear-gradient(#ff9a00, #ff9a00) !important;
              border-color: #ff9a00 !important;
              color: #ffffff !important;
            }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background:#ff9a00;font-family:${fontFamily};color:#171717;">
      <div class="email-shell" style="padding:32px 16px;background:linear-gradient(180deg,#ffe0af 0%,#ffb84d 52%,#ff9624 100%);font-family:${fontFamily};">
        <div style="max-width:560px;margin:0 auto;">
          <div style="margin-bottom:18px;text-align:center;">
            ${
              escapedLogoUrl
                ? `<img
              src="${escapedLogoUrl}"
              alt="horok logo"
              width="76"
              height="76"
              style="display:block;width:76px;height:76px;margin:0 auto 0;"
            />`
                : ""
            }
            <div class="email-brand" style="font-size:30px;line-height:1;font-weight:800;letter-spacing:-0.04em;color:black;">
              c.horok
            </div>
          </div>

          <div class="email-card" style="background:#ffffff;border:1px solid #ece8e1;border-radius:24px;padding:40px 32px;box-shadow:0 12px 40px rgba(15,23,42,0.06);">
            <h1 class="email-title" style="margin:0 0 12px;text-align:center;font-size:25px;line-height:1.35;font-weight:800;color:#171717;">
              로그인 하실거죠? 😉
            </h1>

            <p class="email-copy" style="margin:0 0 8px;text-align:center;font-size:15px;line-height:1.8;color:#525252;">
              <strong class="email-strong" style="color:#171717;">${escapedIdentifier}</strong> 계정으로 로그인하려면
              아래 버튼을 눌러주세요.
            </p>
            <p class="email-copy" style="margin:0 0 10px;text-align:center;font-size:14px;line-height:1.8;color:#737373;">
              비밀번호 없이 바로 로그인할 수 있는 1회용 링크입니다.
            </p>

            <p class="email-copy" style="margin:0 0 10px;text-align:center;font-size:14px;line-height:1.8;color:#737373;">
              (로그인 링크는 15분 후에 만료됩니다.)
            </p>

            <p class="email-copy" style="margin:0 0 28px;text-align:center;font-size:14px;line-height:1.8;color:#737373;">
              로그인 후, 프로필 페이지에서 비밀번호를 재설정하는 걸 권장드려요.
            </p>

            <div style="text-align:center;margin-bottom:28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td
                    class="email-button-cell"
                    bgcolor="#ff9a00"
                    style="border-radius:14px;background-color:#ff9a00;background-image:linear-gradient(#ff9a00,#ff9a00);box-shadow:0 10px 24px rgba(255,154,0,0.28);"
                  >
                    <a
                      class="email-button-link"
                      href="${escapedUrl}"
                      style="display:inline-block;padding:14px 24px;border:1px solid #ff9a00;border-radius:14px;background-color:#ff9a00;background-image:linear-gradient(#ff9a00,#ff9a00);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;"
                    >
                      로그인
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <div class="email-note" style="padding:16px 18px;border-radius:16px;background:#fafaf9;border:1px solid #ece8e1;">
              <p class="email-note-title" style="margin:0 0 8px;font-size:13px;font-weight:700;color:#171717;">
                링크가 열리지 않나요?
              </p>
              <p class="email-note-copy" style="margin:0;font-size:13px;line-height:1.7;color:#737373;word-break:break-all;">
                브라우저에 이 주소를 그대로 붙여 넣으세요.<br />
                <a class="email-link" href="${escapedUrl}" style="color:#c96a00;text-decoration:none;">${escapedUrl}</a>
              </p>
            </div>
          </div>

          <div style="padding:18px 8px 0;text-align:center;">
            <p class="email-footer" style="margin:0 0 6px;font-size:12px;line-height:1.7;color:#8a8a8a;">
              이 링크는 <strong style="color:#525252;">${escapedHost}</strong> 에서만 사용할 수 있습니다.
            </p>
            <p class="email-footer" style="margin:0;font-size:12px;line-height:1.7;color:#8a8a8a;">
              직접 요청하지 않았다면 이 메일은 무시하셔도 됩니다.
            </p>
          </div>
        </div>
      </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeEmailSubjectValue(value: string) {
  return value.replaceAll(/[\r\n]+/g, " ").trim();
}

async function getLoginMailSubjectName(identifier: string) {
  const user = await findUserByEmail(identifier);
  const candidate = user?.name?.trim() || identifier;

  return sanitizeEmailSubjectValue(candidate);
}

function getEscapedEmailLogoUrl() {
  const logoUrl = process.env.EMAIL_LOGO_URL?.trim();

  if (!logoUrl) {
    return null;
  }

  return escapeHtml(logoUrl);
}
