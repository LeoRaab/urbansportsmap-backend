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
exports.compareHashStrings = exports.hashString = void 0;
const bcrypt = require("bcryptjs");
const http_error_1 = require("../models/http-error");
const hashString = (stringToHash, salt = 12) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt.hash(stringToHash, salt);
    }
    catch (e) {
        return null;
    }
});
exports.hashString = hashString;
const compareHashStrings = (stringA, stringB) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isEqual = yield bcrypt.compare(stringA, stringB);
        return { isEqual };
    }
    catch (e) {
        return {
            isEqual: false,
            error: new http_error_1.default('Could not log you in, please check your credentials and try again.', 500)
        };
    }
});
exports.compareHashStrings = compareHashStrings;
//# sourceMappingURL=handle-crypt.js.map