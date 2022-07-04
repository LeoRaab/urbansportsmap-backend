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
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const user_1 = require("../models/user");
const handle_crypt_1 = require("../util/handle-crypt");
const base_repository_1 = require("./base-repository");
class UsersRepository extends base_repository_1.default {
    constructor() {
        super(user_1.default);
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: existingUser, error: readError } = yield this.readOne({ $or: [{ email: user.email }, { name: user.name }] });
            if (readError) {
                return { error: readError };
            }
            if (existingUser) {
                return { error: new http_error_1.default(messages_1.default.USER_EXISTS, 422) };
            }
            const hashedPassword = yield (0, handle_crypt_1.hashString)(user.password);
            if (!hashedPassword) {
                return { error: new http_error_1.default(messages_1.default.SIGNUP_FAILED, 500) };
            }
            const newUser = {
                email: user.email,
                password: hashedPassword,
                name: user.name,
                isVerified: user.isVerified,
                verifyString: user.verifyString,
                comments: [],
                favorites: []
            };
            const { item: createdUser, error: creationError } = yield this.create(newUser);
            if (creationError) {
                return { error: creationError };
            }
            if (!createdUser) {
                return { error: new http_error_1.default(messages_1.default.SIGNUP_FAILED, 500) };
            }
            return { userId: createdUser.id };
        });
    }
}
exports.default = UsersRepository;
//# sourceMappingURL=users-repository.js.map