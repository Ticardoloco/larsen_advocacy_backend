import { Request, Response } from "express";
import mongoose from "mongoose";
import { Impart } from "../models/impactModel.js";

/**
 * @desc    Create a new impact metric
 * @route   POST /api/impacts
 * @access  Private (Admin / Super Admin)
 */

export const createImpact = async (req: Request, res: Response) => {
  try {
    const { value, suffix, label } = req.body;

    // Basic validation check
    if (value === undefined || !label) {
      return res.status(400).json({
        message: "Value and label are required in the fields",
      });
    }

    const newImpact = await Impart.create({
      value,
      suffix: suffix || "",
      label,
    });

    return res.status(201).json({
      message: "Impact metric created successfully",
      data: newImpact,
    });
  } catch (error: any) {
    console.error("Error creating impart:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

/**
 * @desc    Get all impact metrics
 * @route   GET /api/impacts
 * @access  Public
 */

export const getAllImparts = async (_req: Request, res: Response) => {
  try {
    const imparts = await Impart.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Impact metrics fetched successfully",
      count: imparts.length,
      data: imparts,
    });
  } catch (error: any) {
    console.error("Error fetching impacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update an impact metric by ID
 * @route   PUT /api/impacts/:id
 * @access  Private (Admin / Super Admin)
 */

export const updateImpact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid impact ID format",
      });
    }

    const updateData = { ...req.body };

    const updatedImpact = await Impart.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true },
    );

    if (!updatedImpact) {
      return res.status(404).json({
        message: "Impact metric not found",
      });
    }

    return res.status(200).json({
      message: "Impact metric updated successfully",
      data: updatedImpact,
    });
  } catch (error: any) {
    console.error("Error updating impact:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

/**
 * @desc    Delete an impact metric by ID
 * @route   DELETE /api/impacts/:id
 * @access  Private (Admin / Super Admin)
 */

export const deleteImpact = async(req: Request, res: Response) =>{
    try {
        const {id} = req.params as {id: string};

        if (!mongoose.Types.ObjectId.isValid(id)) {
           return res.status(400).json({
            message: "Invalid Impart ID format"
           }) 
        }

        const deleteImpact = await Impart.findByIdAndDelete(id);
        
        if (!deleteImpact) {
            return res.status(404).json({
                message: "Impact metric not found"
            });
        }

        return res.status(200).json({
            message: "Impact metric deleted successfully",
        });
    } catch (error: any) {
       console.error("Error deleting impact:", error);
    return res.status(500).json({ message: "Internal server error" }); 
    }
}

export default {
    createImpact,
    getAllImparts,
    updateImpact,
    deleteImpact
}
