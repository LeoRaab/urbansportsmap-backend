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
const nodemailer = require("nodemailer");
const sendMail = (email, verifyString) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer.createTransport({
        host: process.env.CONFIRM_MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.CONFIRM_MAIL_ADDRESS,
            pass: process.env.CONFIRM_MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const mailOptions = {
        from: process.env.CONFIRM_MAIL_ADDRESS,
        sender: 'Urban Sports Map',
        to: email,
        subject: 'Email-Adresse bestätigen',
        html: `Klicke bitte <a href="${process.env.HOST}/verify/${verifyString}>hier</a> um deine Email-Adresse zu bestätigen. Danke!`
    };
    return new Promise((res, rej) => {
        transport.sendMail(mailOptions)
            .then((info) => {
            res(true);
            console.log(info);
        })
            .catch((error) => {
            res(false);
            console.log(error);
        });
    });
});
exports.default = sendMail;
//# sourceMappingURL=send-mail.js.map