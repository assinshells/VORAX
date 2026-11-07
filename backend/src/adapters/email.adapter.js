import nodemailer from "nodemailer";
import logger from "../config/logger.js";
import { env } from "../config/env.js";
import { OTP_PURPOSES } from "../constants/auth.constants.js";

let transporter = null;

const getTransporter = () => {
  if (!env.smtp.host) return null;
  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user
      ? { user: env.smtp.user, pass: env.smtp.pass }
      : undefined,
  });
  return transporter;
};

const TEMPLATES = {
  [OTP_PURPOSES.ACTIVATION]: {
    subject: "Підтвердження пошти",
    lead: "Код для активації пошти:",
  },
  [OTP_PURPOSES.RESET]: {
    subject: "Відновлення пароля",
    lead: "Код для відновлення пароля:",
  },
  [OTP_PURPOSES.DELETE]: {
    subject: "Видалення акаунта",
    lead: "Код для підтвердження видалення акаунта:",
  },
  [OTP_PURPOSES.EMAIL_CHANGE]: {
    subject: "Зміна пошти",
    lead: "Код для підтвердження нової пошти:",
  },
};

/**
 * EmailAdapter — отправка писем через SMTP (nodemailer).
 * В dev письма попадают в Mailpit: http://localhost:8025
 */
export const EmailAdapter = {
  async sendOtp(email, otp, purpose = OTP_PURPOSES.RESET) {
    const tpl = TEMPLATES[purpose] ?? TEMPLATES[OTP_PURPOSES.RESET];
    const transport = getTransporter();

    if (!transport) {
      logger.info(`SMTP not configured. [${purpose}] email=${email} otp=${otp}`);
      return;
    }

    await transport.sendMail({
      from: env.smtp.from,
      to: email,
      subject: tpl.subject,
      text: `${tpl.lead} ${otp}\n\nКод діє ${Math.round(env.otpTtlSeconds / 60)} хв.`,
      html: `<p>${tpl.lead}</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>Код діє ${Math.round(env.otpTtlSeconds / 60)} хв.</p>`,
    });
  },
};
