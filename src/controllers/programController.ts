import { Request, Response } from "express";
import mongoose from "mongoose";
import Program from "../models/programModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
/**
 * @desc    Create a new program
 * @route   POST /api/programs
 * @access  Private (Admin / Super Admin)
 */
export const createProgram = async (req: Request, res: Response) => {
  try {
    const createData: any = { ...req.body };

    const file = (req as any).file;
    if (file) {
      const imageUrl = await uploadToCloudinary(file.buffer, "larsen_programs");
      createData.image = imageUrl;
    }

    // Safely parse body (Splits ONLY by pipe '|' so commas stay safe)
    if (createData.body && typeof createData.body === "string") {
      try {
        createData.body = JSON.parse(createData.body);
      } catch (error) {
        if (!createData.body.startsWith("[")) {
          createData.body = createData.body
            .split("|") 
            .map((s: string) => s.trim());
        }
      }
    }
    
    if (createData.ctas && typeof createData.ctas === "string") {
      try {
        createData.ctas = JSON.parse(createData.ctas);
      } catch (error) {
        if (
          typeof createData.ctas === "string" &&
          !createData.ctas.startsWith("[")
        ) {
          createData.ctas = createData.ctas
            .split("|")
            .map((s: string) => s.trim());
        }
      }
    }
    // Safely handle callout
    if (createData.callout) {
      if (typeof createData.callout === "string") {
        try {
          createData.callout = JSON.parse(createData.callout);
        } catch (error) {
          createData.callout = undefined;
        }
      }
      
      // If title and body are empty, strip it out completely
      if (
        createData.callout &&
        typeof createData.callout === "object" &&
        (!createData.callout.title || createData.callout.title.trim() === "") &&
        (!createData.callout.body || createData.callout.body.trim() === "")
      ) {
        createData.callout = undefined;
      }
    } else {
      createData.callout = undefined;
    }
    // Generate slug from name if name exists
    if (createData.name) {
      createData.slug = createData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const newProgram = await Program.create(createData);

    return res.status(201).json({
      message: "Program created successfully",
      data: newProgram,
    });
  } catch (error: any) {
    console.error("Error creating program:", error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        error: error.message || String(error),
      });
  }
};

/**
 * @desc    Get all programs
 * @route   GET /api/programs
 * @access  Public
 */

export const getAllPrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Programs fetched successfully",
      count: programs.length,
      data: programs,
    });
  } catch (error: any) {
    console.error("Error fetching programs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get a single program by slug or ID
 * @route   GET /api/programs/:slug
 * @access  Public
 */

export const getProgramByslug = async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    const slug = Array.isArray(slugParam) ? (slugParam[0] ?? "") : slugParam;
    const program = await Program.findOne({
      $or: [
        { slug },
        ...(mongoose.Types.ObjectId.isValid(slug) ? [{ _id: slug }] : []),
      ],
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    return res.status(200).json({
      message: "Program fetched successfully",
      data: program,
    });
  } catch (error: any) {
    console.error("Error fetching program:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update a program by ID (with optional new image)
 * @route   PUT /api/programs/:id
 * @access  Private (Admin / Super Admin)
 */
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    const file = (req as any).file;
    if (file) {
      const imageUrl = await uploadToCloudinary(file.buffer, "larsen_programs");
      updateData.image = imageUrl;
    }else {
      delete updateData.image;
    }

    // Safely parse body (Splits by pipe '|' if not valid JSON)
    if (updateData.body && typeof updateData.body === "string") {
      try {
        updateData.body = JSON.parse(updateData.body);
      } catch (error) {
        if (!updateData.body.startsWith("[")) {
          updateData.body = updateData.body
            .split("|")
            .map((s: string) => s.trim());
        }
      }
    }

    // Safely parse ctas (Splits by pipe '|' if not valid JSON)
    if (updateData.ctas && typeof updateData.ctas === "string") {
      try {
        updateData.ctas = JSON.parse(updateData.ctas);
      } catch (error) {
        if (!updateData.ctas.startsWith("[")) {
          updateData.ctas = updateData.ctas
            .split("|")
            .map((s: string) => s.trim());
        }
      }
    }

    // Safely handle callout during updates
    if (updateData.callout) {
      if (typeof updateData.callout === "string") {
        try {
          updateData.callout = JSON.parse(updateData.callout);
        } catch (error) {
          updateData.callout = undefined;
        }
      }

      if (
        updateData.callout &&
        typeof updateData.callout === "object" &&
        (!updateData.callout.title || updateData.callout.title.trim() === "") &&
        (!updateData.callout.body || updateData.callout.body.trim() === "")
      ) {
        updateData.callout = undefined;
      }
    } else if (updateData.callout === "" || updateData.callout === "{}") {
      updateData.callout = undefined;
    }

    if (updateData.name) {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // 💡 Sanitize empty/undefined strings so partial updates don't fail schema checks
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "" || updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after"},
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }
    return res.status(200).json({
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (error: any) {
    console.error("Error updating program:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message || String(error) 
    });
  }
};

/**
 * @desc    Delete a program by ID
 * @route   DELETE /api/programs/:id
 * @access  Private (Admin / Super Admin)
 */

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as {id: string};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid program format ID"
      })
    }
    const deletedProgram = await Program.findByIdAndDelete(id);
    if (!deletedProgram) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    return res.status(200).json({
      message: "Program deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting program:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createProgram,
  getAllPrograms,
  getProgramByslug,
  updateProgram,
  deleteProgram,
};
