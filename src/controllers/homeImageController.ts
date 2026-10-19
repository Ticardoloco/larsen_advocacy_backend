import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import HomeImage from "../models/homeImageModel.js";

/**
 * @desc    Get home rotating images for frontend
 * @route   GET /api/home-images
 * @access  Public
 */
export const getHomeImages = async (_req: Request, res: Response) => {
    try {
        let homeImageDoc = await HomeImage.findOne();
        if (!homeImageDoc) {
            homeImageDoc = await HomeImage.create({ images: [] });
        }

        return res.status(200).json({
            message: "Home images fetched successfully",
            count: homeImageDoc.images.length,
            data: homeImageDoc.images,
        });
    } catch (error: any) {
        console.error("Error fetching home images", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        });
    }
};

/**
 * @desc    Upload a new image to Cloudinary and add it to the home images array (Admin / Super Admin)
 * @route   POST /api/home-images
 * @access  Private (admin, super-admin)
 */
export const addHomeImage = async (req: Request, res: Response) => {
    try {
        // Ensure a file was uploaded via multer middleware
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
            });
        }

        // Upload the file buffer directly to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "laef/home-carousel" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file!.buffer);
        });

        const newImageItem = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };

        // Find or create the home image document and push the new image into the array
        let homeImageDoc = await HomeImage.findOne();
        if (!homeImageDoc) {
            homeImageDoc = await HomeImage.create({ images: [newImageItem] });
        } else {
            homeImageDoc.images.push(newImageItem);
            await homeImageDoc.save();
        }

        return res.status(201).json({
            message: "Image uploaded and added successfully",
            data: homeImageDoc.images,
        });
    } catch (error: any) {
        console.error("Error uploading home image", error);
        return res.status(500).json({
            message: "Internal server error during upload",
            error: error.message || String(error),
        });
    }
};

/**
 * @desc    Delete an image from Cloudinary and remove it from the array by publicId or ID
 * @route   DELETE /api/home-images/:publicId
 * @access  Private (admin, super-admin)
 */
export const deleteHomeImage = async (req: Request, res: Response) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ message: "Image publicId is required" });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove from MongoDB array
        const homeImageDoc = await HomeImage.findOne();
        if (homeImageDoc) {
            homeImageDoc.images = homeImageDoc.images.filter(
                (img) => img.publicId !== publicId
            );
            await homeImageDoc.save();
        }

        return res.status(200).json({
            message: "Image deleted successfully",
            data: homeImageDoc ? homeImageDoc.images : [],
        });
    } catch (error: any) {
        console.error("Error deleting home image", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        });
    }
};
export default {
    getHomeImages,
    addHomeImage,
    deleteHomeImage,
};