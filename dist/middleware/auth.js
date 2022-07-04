"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const http_error_1 = require("../models/http-error");
const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return next(new http_error_1.default('Authentication failed', 401));
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(new http_error_1.default('Authentication failed!', 401));
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decodedToken.userId;
        return next();
    }
    catch (e) {
        return next(new http_error_1.default('Authentication failed!', 401));
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map