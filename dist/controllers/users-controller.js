"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verify = exports.signup = exports.getUserById = void 0;
const express_validator_1 = require("express-validator");
const uuid = require("uuid");
const http_error_1 = require("../models/http-error");
const users_repository_1 = require("../repositories/users-repository");
const handle_jwt_1 = require("../util/handle-jwt");
const handle_crypt_1 = require("../util/handle-crypt");
const messages_1 = require("../constants/messages");
const send_mail_1 = require("../util/send-mail");
const usersRepository = new users_repository_1.default();
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, error } = yield usersRepository.readById(req.params.userId, { projection: ['-password'] });
    if (error) {
        return next(error);
    }
    if (!result) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        user: result.toObject({ getters: true })
    });
});
exports.getUserById = getUserById;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(messages_1.default.INVALID_INPUT, 422));
    }
    const { email, password, name } = req.body;
    const verifyString = uuid.v4();
    const newUser = { email, password, name, isVerified: false, verifyString };
    const { userId, error } = yield usersRepository.createUser(newUser);
    if (error) {
        return next(error);
    }
    if (!userId) {
        return next(new http_error_1.default(messages_1.default.SIGNUP_FAILED, 500));
    }
    const isEmaiSent = yield (0, send_mail_1.default)(email, verifyString);
    if (!isEmaiSent) {
        return next(new http_error_1.default(messages_1.default.SIGNUP_FAILED, 500));
    }
    res.status(201).json({
        message: messages_1.default.SIGNUP_SUCCESSFUL
    });
});
exports.signup = signup;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.verifyString) {
        return next(new http_error_1.default(messages_1.default.MISSING_PARAMETERS, 404));
    }
    const verifyString = req.params.verifyString;
    const { result: user, error } = yield usersRepository.readOne({ verifyString });
    if (error) {
        return next(error);
    }
    if (!user) {
        return next(new http_error_1.default(messages_1.default.VERIFY_FAILED, 500));
    }
    user.isVerified = true;
    try {
        user.save();
    }
    catch (e) {
        return next(new http_error_1.default(messages_1.default.VERIFY_FAILED, 500));
    }
    res.status(201).json({
        message: messages_1.default.VERIFY_SUCCESSFUL
    });
});
exports.verify = verify;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(messages_1.default.INVALID_INPUT, 422));
    }
    const { email, password } = req.body;
    const { result: identifiedUser, error: readError } = yield usersRepository.readOne({ email: email });
    if (readError) {
        return { error: readError };
    }
    if (!identifiedUser) {
        return next(new http_error_1.default(messages_1.default.INVALID_CREDENTIALS, 401));
    }
    if (!identifiedUser.isVerified) {
        return next(new http_error_1.default(messages_1.default.USER_NOT_VERIFIED, 401));
    }
    const { isEqual: isValidPassword, error } = yield (0, handle_crypt_1.compareHashStrings)(password, identifiedUser.password);
    if (error) {
        return next(error);
    }
    if (!isValidPassword) {
        return next(new http_error_1.default(messages_1.default.INVALID_CREDENTIALS, 401));
    }
    const token = (0, handle_jwt_1.signToken)(identifiedUser.id, identifiedUser.email);
    if (!token) {
        return next(new http_error_1.default(messages_1.default.LOGIN_FAILED, 500));
    }
    res.json({
        message: messages_1.default.LOGIN_SUCCESSFUL,
        userId: identifiedUser.id,
        token: token
    });
});
exports.login = login;
//# sourceMappingURL=users-controller.js.map