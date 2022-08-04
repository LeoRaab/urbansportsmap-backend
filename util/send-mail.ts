import * as nodemailer from 'nodemailer';

interface SendOptions {
  email: string;
  subject: string;
  mailText: string;
  mailHtml: string;
}

const sendMail = async (sendOptions: SendOptions): Promise<boolean> => {
  const {email, subject, mailText, mailHtml} = sendOptions;

  const transport = nodemailer.createTransport({
    host: process.env.CONFIRM_MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.CONFIRM_MAIL_ADDRESS,
      pass: process.env.CONFIRM_MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.CONFIRM_MAIL_ADDRESS,
    to: email,
    subject,
    text: mailText,
    html: mailHtml,
  };

  return new Promise((res, rej) => {
    transport
      .sendMail(mailOptions)
      .then((info) => {
        res(true);
        console.log(info);
      })
      .catch((error) => {
        res(false);
        console.log(error);
      });
  });
};

export default sendMail;
