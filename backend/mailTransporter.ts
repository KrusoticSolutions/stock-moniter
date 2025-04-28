import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailTransporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (
  recipientEmail: string,
  subject: string,
  message: string
) => {
  try {
    const info = await mailTransporter.sendMail({
      from: "Krushang <temp@krushang.dev>",
      to: recipientEmail,
      subject,
      text: message,
    });
    console.log("Email sent: " + JSON.stringify(info));
    return info.messageId;
  } catch (e) {
    console.log(e);
  }
};
export default sendEmail;
