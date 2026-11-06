import { UserService } from "../services/user.service.js";
import { validateAvatarRequest } from "../validators/user.validator.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

export const UserController = {
  me: async (req, res, next) => {
    try {
      const user = await UserService.getProfile(req.userId);
      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  updateAvatar: async (req, res, next) => {
    try {
      validateAvatarRequest(req.body);
      const user = await UserService.setAvatar(req.userId, req.body.avatar);
      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};
