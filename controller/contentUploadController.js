export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PNG image file is required"
            });
        }

        const imageUrl =
            `/uploads/content/${req.file.filename}`;

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                imageUrl
            }
        });
    } catch (error) {
        next(error);
    }
};