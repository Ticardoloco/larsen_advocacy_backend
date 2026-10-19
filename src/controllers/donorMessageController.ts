import { Request, Response } from "express";
import DonorMessage from "../models/donorMessageModel.js";
import mongoose from "mongoose";

/**
 * @desc   Create a new donor's messsage
 * @route  POST /api/donor-message
 * @access Private (admin, super-admin)
 */

export const createDonorMessage = async (req: Request, res: Response)=>{
    try {
        const {donorName, message, advise} = req.body;
        
        if (!donorName || !message || !advise) {
            return res.status(400).json({
                message: "Donor name, message, and advice field are required",
            })
        }

        const newDonorMessage = await DonorMessage.create({
            donorName,
            message,
            advise
        });

        return res.status(201).json({
            message: "Donor message created successfully",
            data: newDonorMessage,
        })
    } catch (error: any) {
        console.error("Error creating donor message", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error)
        });   
    }
};

/**
 * @desc   Get all donors message
 * @route  GET /api/donor-message
 * @access Public
 */

export const getAllDonorMessage = async (_req: Request, res: Response) =>{
    try {
        const donorsMessage = await DonorMessage.find().sort({createdAt: -1});
        return res.status(200).json({
            message: "Donors message fetched successfully",
            count: donorsMessage.length,
            data: donorsMessage,
        })
    } catch (error) {
       console.error("Error fetching donors message", error);
       return res.status(500).json({
        message: "Internal server error"
       }); 
    }
};

/**
 * @desc   Update donor message by ID
 * @route  PUT /api/donor-message/:id
 * @access Private (admin, super-admin)
 */

export const updateDonorMessage = async (req: Request, res:Response)=>{
    try {
        const {id} = req.params as {id: string};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid donor message ID format"
            });
        }

        const updateData = {...req.body};

        const updateDonorMessage = await DonorMessage.findByIdAndUpdate(
            id,
            {$set: updateData},
            {returnDocument: "after", runValidators: true}
        );

        if (!updateDonorMessage) {
            return res.status(404).json({
                message: "Donor message not found"
            });
        }

        return res.status(200).json({
            message: "Donor message updated successfully",
            data: updateDonorMessage
        })
    } catch (error) {
       console.error("Error updating donor message", error);
       return res.status(500).json({
            message: "Internal server error",
            error
       }) 
    }
}

/**
 * @desc   Delete donor message by ID
 * @route  DELETE /api/donor-message
 * @access Private ("admin", super-admin)
 */

export const deleteDonorMessage = async (req: Request, res: Response)=>{
    try {
        const {id} = req.params as {id:string};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid donor message format ID"
            });
        };

        const deleteDonorMessage = await DonorMessage.findByIdAndDelete(id);
        if (!deleteDonorMessage) {
            return res.status(404).json({
                message: "Donor message not found"
            });
        }
        return res.status(200).json({
            message: "Donor message deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting donor message", error);
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

export default {
    createDonorMessage,
    getAllDonorMessage,
    updateDonorMessage,
    deleteDonorMessage
}