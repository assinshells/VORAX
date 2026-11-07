import { UserRepository } from "../repositories/user.repository.js";
import { PresenceRepository } from "../repositories/presence.repository.js";
import { OtpRepository } from "../repositories/otp.repository.js";
import { OtpService } from "./otp.service.js";
import { EmailAdapter } from "../adapters/email.adapter.js";
import { authConfig } from "../config/auth.config.js";
import { toProfileDto } from "../dto/user.dto.js";
import {
  ConflictException,
  NotFoundException,
  OtpExpiredException,
} from "../exceptions/auth.exceptions.js";
import { AUTH_ERRORS, OTP_PURPOSES } from "../constants/auth.constants.js";

// Ответ всегда содержит serverTime: фронтенд считает таймер удаления
// по часам сервера, а не по часам клиента.
const respond = async (row) => ({
  user: toProfileDto(row, await PresenceRepository.isOnline(row.id)),
  serverTime: new Date().toISOString(),
});

const requireUser = (row) => {
  if (!row) throw new NotFoundException();
  return row;
};

export const UserService = {
  async getProfile(userId) {
    return respond(requireUser(await UserRepository.findProfileById(userId)));
  },

  async saveSetup(userId, data) {
    const result = await UserRepository.saveSetup(userId, data);
    if (result === "taken")
      throw new ConflictException(AUTH_ERRORS.NICKNAME_TAKEN);
    await PresenceRepository.touch(userId);
    return respond(requireUser(result));
  },

  async restart(userId) {
    return respond(requireUser(await UserRepository.restart(userId)));
  },

  async heartbeat(userId) {
    await PresenceRepository.touch(userId);
    return { online: true };
  },

  // ---- Удаление аккаунта (с отсрочкой) --------------------------------

  async requestDeletion(userId) {
    const user = requireUser(await UserRepository.findById(userId));
    const otp = await OtpService.generateOtp(userId, OTP_PURPOSES.DELETE);
    await EmailAdapter.sendOtp(user.email, otp, OTP_PURPOSES.DELETE);
    return { success: true };
  },

  async confirmDeletion(userId, otpCode) {
    await OtpService.validateOtp(userId, OTP_PURPOSES.DELETE, otpCode);
    await OtpService.invalidateOtp(userId, OTP_PURPOSES.DELETE);
    const row = await UserRepository.markForDeletion(
      userId,
      authConfig.accountDeletionDays,
    );
    return respond(requireUser(row));
  },

  async cancelDeletion(userId) {
    return respond(requireUser(await UserRepository.cancelDeletion(userId)));
  },

  // ---- Смена email: код уходит на НОВУЮ почту --------------------------

  async requestEmailChange(userId, email) {
    const current = requireUser(await UserRepository.findById(userId));
    if (current.email === email)
      throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN);
    if (await UserRepository.findByEmail(email))
      throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN);

    const otp = await OtpService.generateOtp(userId, OTP_PURPOSES.EMAIL_CHANGE);
    await OtpRepository.savePendingEmail(userId, email);
    await EmailAdapter.sendOtp(email, otp, OTP_PURPOSES.EMAIL_CHANGE);
    return { success: true };
  },

  async confirmEmailChange(userId, otpCode) {
    await OtpService.validateOtp(userId, OTP_PURPOSES.EMAIL_CHANGE, otpCode);
    const email = await OtpRepository.getPendingEmail(userId);
    if (!email) throw new OtpExpiredException();

    const result = await UserRepository.updateEmail(userId, email);
    if (result === "taken") throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN);

    await OtpService.invalidateOtp(userId, OTP_PURPOSES.EMAIL_CHANGE);
    await OtpRepository.deletePendingEmail(userId);
    return respond(requireUser(result));
  },
};
