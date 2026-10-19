import { Request, Response } from "express";
import mongoose from "mongoose";
import { Gallery } from "../models/galleryModel.js";

import { uploadToCloudinary } from "../config/cloudinary.js";

/**
 * @desc   Create a new gallery item with image upload and auto-incremented tone
 * @route  POST /api/gallery
 * @access Private (admin, super-admin)
 */

export const createGallery = async (req: Request, res: Response) => {
  try {
    const createData: any = { ...req.body };
    const file = (req as any).file;

    if (!createData.caption || !createData.category || !createData.year) {
      return res.status(400).json({
        message: "Caption, category, and year are required fields",
      });
    }

    if (!file) {
      return res.status(400).json({
        message: "Gallery Image file is required",
      });
    }

    const imageUrl = await uploadToCloudinary(file.buffer, "larsen_gallery");
    createData.image = imageUrl;

    const lastItem = await Gallery.findOne().sort({ tone: -1 });
    const nextTone =
      lastItem && typeof lastItem.tone === "number" && !isNaN(lastItem.tone)
        ? lastItem.tone + 1
        : 0;
    createData.tone = nextTone;

    const newGalleryItem = await Gallery.create(createData);

    return res.status(201).json({
      message: "Gallery Item created successfully",
      data: newGalleryItem,
    });
  } catch (error: any) {
    console.error("Error creating gallery item:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

/**
 * @desc   Get all gallery items
 * @route  GET /api/gallery
 * @access Public
 */

export const getAllGalleryItems = async (_req:Request, res: Response) =>{
    try {
        const galleryItems = await Gallery.find().sort({createdAt: -1});
        return res.status(200).json({
            message: "Gallery items fetched successfully",
            data: galleryItems,
        });
    } catch (error: any) {
        console.error("Error fetching gallery");
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @desc   Update a gallery item by ID (with optional new image)
 * @route  PUT /api/gallery/:id
 * @access Private (admin, super-Admin)
 */

export const updateGallery = async(req:Request, res: Response)=>{
  try {
    const {id} = req.params as {id:string};
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid gallery ID format"
      });
    }

    const updateData = {...req.body};
    const file = (req as any).file;

    if (file) {
      const imageUrl = await uploadToCloudinary(file.buffer, "larsen_gallery");
      updateData.image = imageUrl
    }else{
      delete updateData.image;
    }

    Object.keys(updateData).forEach((key)=>{
      if (updateData[key] === "" || updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const updateGallery = await Gallery.findByIdAndUpdate(
      id,
      {$set: updateData},
      {returnDocument: "after"}
    );

    if (!updateGallery) {
      return res.status(404).json({
        message: "Gallery item not found"
      })
    };

    return res.status(200).json({
      message: "Gallery item updated successfully",
      data: updateGallery
    })
  } catch (error: any) {
    console.error("Error updating Gallery", error);
    return res.status(500).json({
      message: "Internal server error" ,
      error: error.message || String(error),
    }) 
  }
}

/**
 * @desc   Delete Gallery item by ID
 * @route  DELETE /api/gallery/:id
 * @access Private (admin, super-admin)
 */

export const deleteGallery =async (req:Request, res: Response)=>{
  try {
    const {id} = req.params as {id:string};
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Gallery ID format"
      });
    }

    const deleteGallery = await Gallery.findByIdAndDelete(id);

    if (!deleteGallery) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    };

    return res.status(200).json({
      message: "Gallery item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Gallery", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export default {
  createGallery,
  getAllGalleryItems,
  updateGallery,
  deleteGallery
}