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

const passwordResetTemplate = (resetUrl) => {
    return {
        subject: "Reset Your Valdoxan Admin Password",

        text: `
You requested to reset your Valdoxan Admin password.

Reset your password using the link below:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.

Regards,
Valdoxan Admin
        `,

        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        width: 100%;
        padding: 40px 0;
    ">

        <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-sizing: border-box;
        ">

            <h2 style="
                margin-top: 0;
                color: #222222;
            ">
                Reset Your Valdoxan Admin Password
            </h2>

            <p style="
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
            ">
                You requested to reset your Valdoxan Admin password.
            </p>

            <p style="
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
            ">
                Click the button below to create a new password:
            </p>

            <div style="
                margin: 30px 0;
                text-align: center;
            ">

                <a
                    href="${resetUrl}"
                    target="_blank"
                    style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #000000;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 15px;
                    "
                >
                    Reset Password
                </a>

            </div>

            <p style="
                color: #555555;
                font-size: 14px;
                line-height: 1.6;
            ">
                This password reset link will expire in
                <strong>15 minutes</strong>.
            </p>

            <p style="
                color: #555555;
                font-size: 14px;
                line-height: 1.6;
            ">
                If you did not request this password reset,
                you can safely ignore this email.
            </p>

            <hr style="
                border: none;
                border-top: 1px solid #eeeeee;
                margin: 30px 0;
            ">

            <p style="
                margin-bottom: 0;
                color: #999999;
                font-size: 12px;
                line-height: 1.5;
            ">
                This is an automated email from Valdoxan Admin.
                Please do not reply to this email.
            </p>

        </div>

    </div>

</body>
</html>
        `
    };
};

export const sendPasswordResetEmail = async (
    email,
    resetUrl
) => {

    const template = passwordResetTemplate(
        resetUrl
    );

    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html
    };

    const result = await transporter.sendMail(
        mailOptions
    );

    return result;
};