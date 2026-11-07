import { UserRepository } from "../repositories/user.repository.js";
import { PresenceRepository } from "../repositories/presence.repository.js";
import {
  ConflictException,
  NotFoundException,
} from "../exceptions/auth.exceptions.js";
import { AUTH_ERRORS } from "../constants/auth.constants.js";

const withStatus = async (user) => ({
  ...user,
  online: await PresenceRepository.isOnline(user.id),
});

export const UserService = {
  async getProfile(userId) {
    const user = await UserRepository.findProfileById(userId);
    if (!user) throw new NotFoundException();
    return withStatus(user);
  },

  async saveSetup(userId, data) {
    const result = await UserRepository.saveSetup(userId, data);
    if (result === "taken") throw new ConflictException(AUTH_ERRORS.NICKNAME_TAKEN);
    if (!result) throw new NotFoundException();
    await PresenceRepository.touch(userId);
    return withStatus(result);
  },

  async restart(userId) {
    const user = await UserRepository.restart(userId);
    if (!user) throw new NotFoundException();
    return withStatus(user);
  },

  async heartbeat(userId) {
    await PresenceRepository.touch(userId);
    return { online: true };
  },
};
