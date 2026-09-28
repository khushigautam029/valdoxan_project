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

export const verifyEmailConnection = async () => {
    await transporter.verify();

    console.log("✅ Brevo SMTP connected successfully");
};

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: {
            name: process.env.MAIL_FROM_NAME,
            address: process.env.MAIL_FROM_EMAIL
        },

        to: email,

        subject: "Valdoxan Admin Login Verification Code",

        text: `Your Valdoxan Admin verification code is ${otp}. This code expires in 10 minutes.`,

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Valdoxan Admin Login</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <div style="
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                ">

                    <div style="
                        padding: 30px;
                        border-bottom: 1px solid #e5e7eb;
                    ">

                        <h1 style="
                            margin: 0;
                            font-size: 26px;
                            color: #1f2937;
                        ">
                            Valdoxan
                        </h1>

                        <p style="
                            margin: 6px 0 0;
                            font-size: 14px;
                            color: #6b7280;
                        ">
                            Admin Portal
                        </p>

                    </div>

                    <div style="padding: 35px 30px;">

                        <h2 style="
                            margin-top: 0;
                            color: #111827;
                            font-size: 21px;
                        ">
                            Verify your login
                        </h2>

                        <p style="
                            color: #4b5563;
                            font-size: 15px;
                            line-height: 1.6;
                        ">
                            Use the verification code below to complete
                            your Valdoxan Admin Portal login.
                        </p>

                        <div style="
                            margin: 30px 0;
                            padding: 20px;
                            text-align: center;
                            background-color: #f3f4f6;
                            border-radius: 8px;
                        ">

                            <span style="
                                font-size: 32px;
                                font-weight: bold;
                                letter-spacing: 8px;
                                color: #111827;
                            ">
                                ${otp}
                            </span>

                        </div>

                        <p style="
                            color: #6b7280;
                            font-size: 14px;
                            line-height: 1.6;
                        ">
                            This code will expire in
                            <strong>10 minutes</strong>.
                        </p>

                        <p style="
                            color: #6b7280;
                            font-size: 14px;
                            line-height: 1.6;
                        ">
                            If you did not attempt to log in,
                            you can safely ignore this email.
                        </p>

                    </div>

                    <div style="
                        padding: 20px 30px;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    ">

                        <p style="
                            margin: 0;
                            text-align: center;
                            color: #9ca3af;
                            font-size: 12px;
                        ">
                            © ${new Date().getFullYear()} Valdoxan Admin Portal
                        </p>

                    </div>

                </div>

            </body>
            </html>
        `
    };

    await transporter.sendMail(mailOptions);
};