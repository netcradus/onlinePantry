import cloudinary from "../configs/cloudinary.js";
import fs from "fs";
import logger from "../utils/logger/winston.config.js";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
        logger.error("Cloudinary upload failed", error);
        return null;
    }
};

export { uploadOnCloudinary };
