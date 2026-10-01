import fs from "fs";
import multer from "multer";
import path from "path";
import AppError from "../utils/appError.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const uploadDirectory = "uploads/content";


if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(
            file.originalname
        ).toLowerCase();

        const fileName =
            `content-${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, fileName);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/png",
        "image/jpeg"
    ];

    if (
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {
        return cb(
            new AppError(
                "Only PNG, JPG and JPEG images are allowed",
                STATUS_CODES.BAD_REQUEST
            )
        );
    }

    cb(null, true);
};


const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


export default upload;
