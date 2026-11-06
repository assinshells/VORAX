import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundException } from "../exceptions/auth.exceptions.js";
import { AVATAR_GENDER_BY_ID } from "../constants/avatar.constants.js";

export const UserService = {
  async getProfile(userId) {
    const user = await UserRepository.findProfileById(userId);
    if (!user) throw new NotFoundException();
    return user;
  },

  async setAvatar(userId, avatar) {
    // Пол берём из каталога по id аватара, а не из тела запроса.
    const gender = AVATAR_GENDER_BY_ID[avatar];
    const user = await UserRepository.updateAvatar(userId, avatar, gender);
    if (!user) throw new NotFoundException();
    return user;
  },
};
