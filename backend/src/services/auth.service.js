import { UserRepository } from "../repositories/user.repository.js";
import { TokenService } from "./token.service.js";
import { OtpService } from "./otp.service.js";
import { PresenceRepository } from "../repositories/presence.repository.js";
import { PasswordProvider } from "../providers/password.provider.js";
import { EmailAdapter } from "../adapters/email.adapter.js";
import logger from "../config/logger.js";
import {
  AuthenticationException,
  ConflictException,
  NotFoundException,
  AuthorizationException,
  EmailNotVerifiedException,
} from "../exceptions/auth.exceptions.js";
import { AUTH_ERRORS, OTP_PURPOSES } from "../constants/auth.constants.js";

export const AuthService = {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AuthenticationException();

    const valid = await PasswordProvider.verify(password, user.password_hash);
    if (!valid) throw new AuthenticationException();

    // Проверяем ПОСЛЕ пароля: статус активации не должен быть виден тому,
    // кто не знает пароль.
    if (!user.email_verified) throw new EmailNotVerifiedException();

    return TokenService.issueTokenPair(user.id);
  },

  async register({ password, email }) {
    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN);

    const passwordHash = await PasswordProvider.hash(password);
    const created = await UserRepository.create({
      passwordHash,
      email,
    });

    if (!created) throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN);

    await this._sendActivationOtp(created.id, email);

    return { email };
  },

  async verifyEmail({ email, otpCode }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    await OtpService.validateOtp(user.id, OTP_PURPOSES.ACTIVATION, otpCode);
    await OtpService.invalidateOtp(user.id, OTP_PURPOSES.ACTIVATION);
    await UserRepository.markEmailVerified(user.id);

    // Код из письма доказывает владение ящиком — сразу открываем сессию.
    return TokenService.issueTokenPair(user.id);
  },

  async resendVerification({ email }) {
    const user = await UserRepository.findByEmail(email);
    // Не раскрываем, существует ли аккаунт и активирован ли он.
    if (!user || user.email_verified) return { success: true };

    await this._sendActivationOtp(user.id, email);
    return { success: true };
  },

  async forgotPassword({ email }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return { success: true };

    const otp = await OtpService.generateOtp(user.id, OTP_PURPOSES.RESET);
    await EmailAdapter.sendOtp(email, otp, OTP_PURPOSES.RESET);
    return { success: true };
  },

  async verifyOtp({ email, otpCode }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    await OtpService.validateOtp(user.id, OTP_PURPOSES.RESET, otpCode);
    await OtpService.invalidateOtp(user.id, OTP_PURPOSES.RESET);

    const verifiedToken = await OtpService.createVerifiedToken(user.id);
    return { verifiedToken };
  },

  async resetPassword({ verifiedToken, password }) {
    const userId = await OtpService.consumeVerifiedToken(verifiedToken);
    if (!userId)
      throw new AuthorizationException(AUTH_ERRORS.RESET_TOKEN_INVALID);

    const passwordHash = await PasswordProvider.hash(password);
    await UserRepository.updatePassword(userId, passwordHash);
    return { success: true };
  },

  async refreshTokens({ refreshToken }) {
    return TokenService.rotateRefreshToken(refreshToken);
  },

  async logout({ refreshToken, userId }) {
    await TokenService.revokeRefreshToken(refreshToken);
    if (userId) await PresenceRepository.clear(userId);
    return { success: true };
  },

  /**
   * Пользователь уже создан — если SMTP временно недоступен, не роняем
   * регистрацию (аккаунт остался бы "занятым" без кода). Ошибка логируется,
   * а код можно запросить повторно через /resend-verification.
   */
  async _sendActivationOtp(userId, email) {
    try {
      const otp = await OtpService.generateOtp(userId, OTP_PURPOSES.ACTIVATION);
      await EmailAdapter.sendOtp(email, otp, OTP_PURPOSES.ACTIVATION);
    } catch (err) {
      logger.error(`Failed to send activation OTP: ${err.message}`);
    }
  },
};
