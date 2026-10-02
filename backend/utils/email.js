import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,

    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
    }
});

export const sendEmail = async ({
    to,
    subject,
    html,
    text
}) => {
    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to,
        subject,
        text,
        html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
};