import * as nodemailer from 'nodemailer';

const sendMail = async (email: string, verifyString: string): Promise<boolean> => {

    const transport = nodemailer.createTransport({
        host: "smtp.ionos.de",
        port: 587,
        secure: false,
        auth: {
            user: "noreply@urbansportsmap.at",
            pass: "1090H3rnals3r!",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions: nodemailer.SendMailOptions = {
        from: 'noreply@urbansportsmap.at',
        sender: 'Urban Sports Map',
        to: email,
        subject: 'Email-Adresse bestätigen',
        html: `Klicke bitte <a href="http://localhost:3000/verify/${verifyString}>hier</a> um deine Email-Adresse zu bestätigen. Danke!`
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