"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jwt = require("jsonwebtoken");
const signToken = (userId, email) => {
    try {
        return jwt.sign({ userId, email }, process.env.JWT_KEY, { expiresIn: '1h' });
    }
    catch (e) {
        return null;
    }
};
exports.signToken = signToken;
//# sourceMappingURL=handle-jwt.js.map