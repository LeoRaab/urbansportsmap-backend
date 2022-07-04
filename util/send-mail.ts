import * as nodemailer from 'nodemailer';

const sendMail = async (email: string, verifyString: string): Promise<boolean> => {

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

    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.CONFIRM_MAIL_ADDRESS,
        sender: 'Urban Sports Map',
        to: email,
        subject: 'Email-Adresse bestätigen',
        html: `Klicke bitte <a href="${process.env.HOST}/verify/${verifyString}>hier</a> um deine Email-Adresse zu bestätigen. Danke!`
    }

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
    })
}

export default sendMail;