import { Request, Response } from "express";
import mongoose from "mongoose";
import Donate from "../models/donateModel.js";

/**
 * @desc   Create a new donate fund
 * @route  POST /api/donate
 * @access Private (admin, super-admin)
 */

export const createDonate = async (req: Request, res: Response) => {
  try {
    const createData = { ...req.body };
    if (!createData.slug || !createData.label || !createData.blurb) {
      return res.status(400).json({
        message: "Slug, label, and blurb field are required",
      });
    }

    const newDonate = await Donate.create(createData);

    return res.status(201).json({
      message: "Donate fund created successfully",
      data: newDonate,
    });
  } catch (error: any) {
    console.error("Error creating Donate", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

/**
 * @desc   Get all donate funds
 * @route  GET /api/donate
 * @access Public
 */

export const getAllDonateFunds = async (req: Request, res: Response) => {
  try {
    const donateFunds = await Donate.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Donate funds fetched successfully",
      count: donateFunds.length,
      data: donateFunds,
    });
  } catch (error) {
    console.error("Error fetching donates", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @desc   Get donate fund by Slug
 * @route  GET /api/donate/:slug
 * @access Public
 */

export const getDonateBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params as {slug: string};
    const donateFund = await Donate.findOne({slug});
    if (!donateFund) {
      return res.status(404).json({
        message: "Donate fund not found",
      });
    }

    return res.status(200).json({
      message: "Donate fund fetched successfully",
      data: donateFund,
    });
  } catch (error) {
    console.error("Error fetching donate", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @desc   Update Donate fund by ID
 * @route  PUT /api/donate/:id
 * @access Private (super-admin)
 */

export const updateDonate = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid donate fund format ID",
      });
    }

    const updateDonate = await Donate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    if (!updateDonate) {
      return res.status(404).json({
        message: "Donate fund not found",
      });
    }

    return res.status(200).json({
      message: "Donate fund updated successfully",
      data: updateDonate,
    });
  } catch (error) {
    console.error("Error updating donate", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @desc   Delete donate fund by ID
 * @route  DELETE /api/donate/:id
 * @access Private (super-admin)
 */
export const deleteDonate = async (req: Request, res: Response)=>{
    try {
        const {id} = req.params as {id: string};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid donate fund format ID",
            });
        };

        const deleteDonate = await Donate.findByIdAndDelete(id);
        if (!deleteDonate) {
            return res.status(404).json({
                message: "Donate fund not found"
            });
        }

        return res.status(200).json({
            message: "Donate fund deleted successfully"
        })
    } catch (error) {
                console.error("Error deleting donate", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    createDonate,
    getAllDonateFunds,
    getDonateBySlug,
    updateDonate,
    deleteDonate
}