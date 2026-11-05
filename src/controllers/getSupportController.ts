import { Request, Response } from "express";
import { GetSupport } from "../models/getSupportModel.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new support request
 * @route  POST /api/support
 * @access  Public
 */
export const createSupportRequest = async (req: Request, res: Response) => {
  try {
    const { category, urgency, message, isAnonymous, fullName, email, phone } =
      req.body;

    if (!category || !urgency || !message) {
      return res.status(400).json({
        message: "Category, urgency, and message are required fields",
      });
    }

    const validUrgencies = ["standard", "high", "critical"];
    if (!validUrgencies.includes(urgency)) {
      return res.status(400).json({
        message:
          "Invalid urgency level. Must be 'standard', 'high', or 'critical'.",
      });
    }

    if (isAnonymous === false && !fullName && !email && !phone) {
      return res.status(400).json({
        message: "Please provide contact details or submit anonymously.",
      });
    }

    const newSupport = await GetSupport.create({
      category: category.trim(),
      urgency,
      message: message.trim(),
      isAnonymous: Boolean(isAnonymous),
      fullName: fullName ? fullName.trim() : undefined,
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined,
    });

    return res.status(201).json({
      message: "Support request submitted successfully.",
      data: newSupport,
    });
  } catch (error: any) {
    console.error("Error creating support request:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

/**
 * @desc    Get all support requests (Admin/Management use)
 * @route   GET /api/support
 * @access  Private (admin, super-admin);
 */

export const getAllSupportRequests = async (req: Request, res: Response) => {
  try {
    const supportRequests = await GetSupport.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Support requests retrieved successfully",
      count: supportRequests.length,
      data: supportRequests,
    });
  } catch (error: any) {
    console.error("Error fetching support requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorDetails: error.message || String(error),
    });
  }
};


/**
 * @desc   Delete support request by ID
 * @route  Delete /api/support
 * @access Private (super-admin)
 */

export const deleteSupportRequest = async (req: Request, res: Response) =>{
    try {
        const {id} = req.params as {id: string};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid support request format ID"
            });
        }

        const deleteSupportRequest = await GetSupport.findByIdAndDelete(id);

        if (!deleteSupportRequest) {
            return res.status(404).json({
                message: "Support request not found",
            })
        }
        return res.status(200).json({
            message: "Support Request deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting support request", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error)
        })
        
    }
}

export default {
    createSupportRequest,
    getAllSupportRequests,
    deleteSupportRequest
}