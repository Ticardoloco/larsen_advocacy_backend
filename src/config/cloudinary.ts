import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer directly to Cloudinary
 * @param fileBuffer - The buffer from req.file.buffer
 * @param folderName - Optional folder name in your Cloudinary account
 */

export const uploadToCloudinary = (fileBuffer: Buffer, folderName: string = "larsen_foundation"): Promise<string> =>{
    return new Promise((resolve, reject) =>{
        const uploadStream = cloudinary.uploader.upload_stream(
           {
             folder: folderName,
             resource_type: "auto"
           },
           (error, result) =>{
            if(error){
                return reject(error);
            }
            if(!result){
                return reject(new Error("Cloudinary upload failed with no result."));
            }
            resolve(result.secure_url);
           }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;