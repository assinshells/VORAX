import { UserService } from "../services/user.service.js";
import {
  validateSetupRequest,
  validateOtpCodeRequest,
  validateEmailChangeRequest,
} from "../validators/user.validator.js";
import { toEmailChangeDto, toOtpCodeDto } from "../dto/user.dto.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

// Единая обёртка: вызвать сервис → { success, ...данные } → ошибки в next().
const handler = (fn) => async (req, res, next) => {
  try {
    const data = await fn(req);
    res.status(HTTP_STATUS.OK).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  me: handler((req) => UserService.getProfile(req.userId)),

  saveSetup: handler((req) => {
    validateSetupRequest(req.body);
    const { nickname, companyName, firstName, lastName } = req.body;
    return UserService.saveSetup(req.userId, {
      nickname,
      companyName,
      firstName,
      lastName,
    });
  }),

  restart: handler((req) => UserService.restart(req.userId)),

  heartbeat: handler((req) => UserService.heartbeat(req.userId)),

  requestDeletion: handler((req) => UserService.requestDeletion(req.userId)),

  confirmDeletion: handler((req) => {
    validateOtpCodeRequest(req.body);
    const { otpCode } = toOtpCodeDto(req.body);
    return UserService.confirmDeletion(req.userId, otpCode);
  }),

  cancelDeletion: handler((req) => UserService.cancelDeletion(req.userId)),

  requestEmailChange: handler((req) => {
    validateEmailChangeRequest(req.body);
    const { email } = toEmailChangeDto(req.body);
    return UserService.requestEmailChange(req.userId, email);
  }),

  confirmEmailChange: handler((req) => {
    validateOtpCodeRequest(req.body);
    const { otpCode } = toOtpCodeDto(req.body);
    return UserService.confirmEmailChange(req.userId, otpCode);
  }),
};
