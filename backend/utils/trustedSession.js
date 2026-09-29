// import crypto from "crypto";

// import {
//     TrustedSession,
//     User
// } from "../models/index.js";

// const TRUSTED_SESSION_DAYS = 30;

// const generateRawToken = () => {
//     return crypto.randomBytes(64).toString("hex");
// };

// const hashToken = (token) => {
//     return crypto
//         .createHash("sha256")
//         .update(token)
//         .digest("hex");
// };


// export const createTrustedSession = async (
//     userId
// ) => {

//     const rawToken =
//         generateRawToken();

//     const tokenHash =
//         hashToken(rawToken);

//     const expiresAt = new Date(
//         Date.now() +
//         TRUSTED_SESSION_DAYS *
//         24 *
//         60 *
//         60 *
//         1000
//     );

//     await TrustedSession.create({
//         userId,
//         tokenHash,
//         expiresAt
//     });

//     return {
//         token: rawToken,
//         expiresAt
//     };
// };


// export const getTrustedSession = async (
//     rawToken
// ) => {

//     if (!rawToken) {
//         return null;
//     }

//     const tokenHash =
//         hashToken(rawToken);

//     const session =
//         await TrustedSession.findOne({
//             where: {
//                 tokenHash,
//                 revokedAt: null
//             },
//             include: [
//                 {
//                     model: User,
//                     as: "user"
//                 }
//             ]
//         });

//     if (!session) {
//         return null;
//     }

//     if (
//         new Date() >
//         session.expiresAt
//     ) {

//         await session.update({
//             revokedAt: new Date()
//         });

//         return null;
//     }

//     if (
//         !session.user ||
//         session.user.status !== "ACTIVE"
//     ) {
//         return null;
//     }

//     return session;
// };


// export const revokeTrustedSession = async (
//     rawToken
// ) => {

//     if (!rawToken) {
//         return;
//     }

//     const tokenHash =
//         hashToken(rawToken);

//     await TrustedSession.update(
//         {
//             revokedAt: new Date()
//         },
//         {
//             where: {
//                 tokenHash,
//                 revokedAt: null
//             }
//         }
//     );
// };