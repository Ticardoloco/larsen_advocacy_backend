import {Request, Response} from "express";
import mongoose from "mongoose";
import {Staff} from "../models/staffModel.js"
import { uploadToCloudinary } from "../config/cloudinary.js";

/**
 * @desc   Create a new staff member with an image upload
 * @route  POST /api/staff
 * @access Private (super-admin)
 */

export const createStaff = async (req: Request, res: Response) =>{
    try {
        const {name, title, bio} = req.body;
        const file = (req as any).file;
         

        if (!name || !title || !bio) {
            return res.status(400).json({
                message: "Name, title, and bio are required fields."
            })
        }

        if (!file) {
           return res.status(400).json({
            message: "Staff profile image file is required",
           });
         }

         const imageUrl = await uploadToCloudinary(file.buffer, "larsen_staff");

        const newStaff = await Staff.create({
            name,
            title,
            bio,
            image: imageUrl,
        });

        return res.status(201).json({
            message: "Staff member created successfully",
            data: newStaff
        })
    } catch (error: any) {
        console.error("Error creating staff", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        })
        
    }
}


/**
 * @desc   Get all staffs
 * @route  GET /api/staff
 * @access Public
 */


export const getAllStaffs = async (_req: Request, res: Response) =>{
    try {
        const staffs = await Staff.find().sort({createdAt: -1});

        return res.status(200).json({
            message: "Staff members fetched successfully",
            count: staffs.length,
            data: staffs
        })

    } catch (error) {
        console.error("Error fetching staffs", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @desc   Update a staff member by ID with optional new image
 * @route  PUT /api/staff/:id
 * @access Private (super-admin)
 */

export const updateStaff = async (req: Request, res: Response) =>{
    try {
      const {id} = req.params as {id: string};
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid staff format ID"
        });
      }

      const updateData = {...req.body};
      const file = (req as any).file;

      if (file) {
        const imageUrl = await uploadToCloudinary(file.buffer, "larsen_staff");
        updateData.image = imageUrl;
      }else{
        delete updateData.image
      }

      const updatedStaff = await Staff.findByIdAndUpdate(
        id,
        {$set: updateData},
        {returnDocument: "after", runValidators: true},
      );

      if (!updatedStaff) {
        return res.status(404).json({
            message: "Staff member not found"
        })
      };

      return res.status(200).json({
        message: "Staff member updated successfully",
        data: updatedStaff,
      })


    } catch (error: any) {
        console.error("Error updating staff", error);
        return res.status(500).json({message: "Internal server error"});  
    }
}

/**
 * @desc   Delete a staff member by ID
 * @route  DELETE /api/staff/:id
 * @access Private (super-admin)
 */

export const deleteStaff = async (req: Request, res: Response) =>{
    try {
        const {id} = req.params as {id: string};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid staff format ID"
            })
        }

        const deleteStaff = await Staff.findByIdAndDelete(id);

        if (!deleteStaff) {
            return res.status(404).json({
                message: "Staff member not found",
            });
        }

        return res.status(200).json({
            message: "Staff member deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting staff", error);
        return res.status(500).json({
            message: "Internal server error"
        })        
    }
}

export default {
    createStaff,
    getAllStaffs,
    updateStaff,
    deleteStaff
}