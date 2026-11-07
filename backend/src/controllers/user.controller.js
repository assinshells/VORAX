import { UserService } from "../services/user.service.js";
import { validateSetupRequest } from "../validators/user.validator.js";
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

  saveSetup: async (req, res, next) => {
    try {
      validateSetupRequest(req.body);
      const { nickname, companyName, firstName, lastName } = req.body;
      const user = await UserService.saveSetup(req.userId, {
        nickname,
        companyName,
        firstName,
        lastName,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  restart: async (req, res, next) => {
    try {
      const user = await UserService.restart(req.userId);
      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  heartbeat: async (req, res, next) => {
    try {
      const result = await UserService.heartbeat(req.userId);
      res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },
};
