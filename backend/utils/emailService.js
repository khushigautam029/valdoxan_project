// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: process.env.BREVO_SMTP_HOST,
//     port: Number(process.env.BREVO_SMTP_PORT),
//     secure: false,

//     auth: {
//         user: process.env.BREVO_SMTP_USER,
//         pass: process.env.BREVO_SMTP_PASSWORD
//     }
// });


// // export const verifyEmailConnection = async () => {
// //     await transporter.verify();
// //     console.log("✅ Brevo SMTP connected successfully");
// // };


// export const sendOtpEmail = async (toEmail, otp) => {
//     try {
//         await transporter.sendMail({
//             from: {
//                 name: process.env.MAIL_FROM_NAME,
//                 address: process.env.MAIL_FROM_EMAIL
//             },
//             to: toEmail,
//             subject: "Valdoxan Admin Portal - Login Verification Code",
//             html: `
// <!DOCTYPE html>

// <html>

// <head>

//     <meta charset="UTF-8">

//     <meta
//         name="viewport"
//         content="width=device-width, initial-scale=1.0"
//     >

//     <title>
//         Valdoxan Admin Portal - Login Verification
//     </title>

// </head>


// <body
//     style="
//         margin:0;
//         padding:0;
//         background:#f4f7fb;
//         font-family:Arial,Helvetica,sans-serif;
//     "
// >

// <table
//     width="100%"
//     cellpadding="0"
//     cellspacing="0"
//     border="0"
//     style="
//         background:#f4f7fb;
//         padding:40px 0;
//     "
// >

// <tr>

// <td align="center">


// <table
//     width="600"
//     cellpadding="0"
//     cellspacing="0"
//     border="0"
//     style="
//         background:#ffffff;
//         border-radius:14px;
//         overflow:hidden;
//         border:1px solid #e5e7eb;
//         box-shadow:0 8px 25px rgba(0,0,0,0.08);
//     "
// >


// <!-- ================= HEADER ================= -->

// <tr>

// <td
//     style="
//         background:#0f766e;
//         padding:35px;
//         text-align:center;
//         color:#ffffff;
//     "
// >

//     <h1
//         style="
//             margin:0;
//             font-size:30px;
//             font-weight:700;
//         "
//     >
//         Valdoxan
//     </h1>


//     <p
//         style="
//             margin:10px 0 0;
//             font-size:16px;
//             color:#dff7f4;
//         "
//     >
//         Admin Portal
//     </p>

// </td>

// </tr>


// <!-- ================= BODY ================= -->

// <tr>

// <td
//     style="
//         padding:40px;
//     "
// >


// <h2
//     style="
//         margin:0 0 20px;
//         color:#1e293b;
//         font-size:24px;
//     "
// >
//     Verify your login
// </h2>


// <p
//     style="
//         margin:0 0 18px;
//         font-size:16px;
//         color:#475569;
//         line-height:1.7;
//     "
// >
//     Hello Admin,
// </p>


// <p
//     style="
//         margin:0 0 18px;
//         font-size:16px;
//         color:#475569;
//         line-height:1.7;
//     "
// >
//     We received a request to sign in to your
//     <strong>Valdoxan Admin Portal</strong>.
// </p>


// <p
//     style="
//         margin:0;
//         font-size:16px;
//         color:#475569;
//         line-height:1.7;
//     "
// >
//     Please use the One-Time Password (OTP) below
//     to complete your login.
// </p>


// <!-- ================= OTP BOX ================= -->

// <div
//     style="
//         margin:35px 0;
//         text-align:center;
//         background:#f0fdfa;
//         border:2px dashed #0f766e;
//         padding:25px;
//         border-radius:12px;
//     "
// >


// <p
//     style="
//         margin:0;
//         font-size:13px;
//         color:#64748b;
//         letter-spacing:1.5px;
//         font-weight:bold;
//     "
// >
//     YOUR VERIFICATION CODE
// </p>


// <h1
//     style="
//         margin:14px 0 0;
//         font-size:42px;
//         line-height:1;
//         letter-spacing:12px;
//         color:#0f766e;
//         font-weight:700;
//     "
// >
//     ${otp}
// </h1>


// </div>


// <!-- ================= EXPIRY MESSAGE ================= -->

// <div
//     style="
//         background:#fff7ed;
//         border-left:5px solid #f59e0b;
//         padding:18px;
//         border-radius:8px;
//     "
// >

// <p
//     style="
//         margin:0;
//         color:#92400e;
//         font-size:14px;
//         line-height:1.6;
//     "
// >

//     <strong>⏰ This OTP is valid for 10 minutes.</strong>

//     <br>

//     For your security, please complete the verification
//     before the code expires.

// </p>

// </div>


// <!-- ================= SECURITY MESSAGE ================= -->

// <p
//     style="
//         margin:30px 0 0;
//         font-size:15px;
//         color:#475569;
//         line-height:1.8;
//     "
// >
//     If you did not attempt to sign in to the
//     Valdoxan Admin Portal, you can safely ignore
//     this email.
// </p>


// <p
//     style="
//         margin:15px 0 0;
//         font-size:15px;
//         color:#475569;
//         line-height:1.8;
//     "
// >

//     For your security,
//     <strong>
//         never share this verification code with anyone.
//     </strong>

// </p>


// </td>

// </tr>


// <!-- ================= FOOTER ================= -->

// <tr>

// <td
//     style="
//         background:#f8fafc;
//         padding:30px;
//         text-align:center;
//         border-top:1px solid #e2e8f0;
//     "
// >


// <p
//     style="
//         margin:0;
//         font-size:14px;
//         color:#64748b;
//     "
// >

//     <strong>
//         Valdoxan Admin Portal
//     </strong>

// </p>


// <p
//     style="
//         margin:10px 0 0;
//         font-size:13px;
//         color:#94a3b8;
//     "
// >
//     Secure access for authorized administrators
// </p>


// <p
//     style="
//         margin:25px 0 0;
//         font-size:12px;
//         color:#94a3b8;
//     "
// >

//     © ${new Date().getFullYear()}
//     Valdoxan Admin Portal.
//     All Rights Reserved.

// </p>


// </td>

// </tr>


// </table>


// </td>

// </tr>

// </table>


// </body>

// </html>
//             `
//         });


//         console.log(
//             `✅ OTP email sent successfully to ${toEmail}`
//         );


//     } catch (error) {

//         console.error(
//             "❌ Email sending error:",
//             error.message
//         );

//         throw new Error(
//             "Unable to send verification email"
//         );
//     }
// };