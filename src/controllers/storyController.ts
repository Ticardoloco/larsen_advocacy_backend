import {Request, Response} from "express";
import {Story} from "../models/storyModel.js"
import mongoose from "mongoose";

/**
 * @desc   Create a new story
 * @route  POST /api/stories
 * @access Private (admin / super-admin)
 */

export const createStory = async (req:Request, res: Response) =>{
    try {
        const {year, title, body} = req.body;

        if (!year || !title || !body) {
            return res.status(400).json({
                message: "Year, title, body are required fields",
            });
        }

        const newStory = await Story.create({
            year,
            title,
            body
        });

        return res.status(201).json({
            message: "Story created successfully",
            data: newStory,
        })
    } catch (error: any) {
        console.error("Error create story", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error,)
        });
        
    }
}


/**
 * @desc   Get all stories
 * @route  GET /api/stories
 * @access Public
 */

export const getAllStories = async (req:Request, res: Response) =>{
    try {
        const stories = await Story.find().sort({createdAt: -1});

        return res.status(200).json({
            message: "Stories fetched successfully",
            count: stories.length,
            data: stories,
        })
    } catch (error: any) {
        console.error("Error fetching stories", error);
        return res.status(500).json({
            message: "Internal server error",
        })
        
    }
}


/**
 * @desc   Update a story by ID
 * @route  UPDATE /api/stories/:id
 * @access private (admin / super-admin)
 */

export const updateStory = async (req: Request, res: Response) =>{
    try {
        const {id} = req.params as {id: string};
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid story ID format",
            });
        }

        const updateData = {...req.body};

        const updateStory = await Story.findByIdAndUpdate(
            id,
            {$set: updateData},
            {returnDocument: "after", runValidators: true},
        );

        if (!updateStory) {
           return res.status(404).json({
            message: "Story not found",
           }) 
        };

        return res.status(200).json({
            message: "Story updated successfully",
            data: updateStory
        });
    } catch (error: any) {
        console.error("Error updating story", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * @desc   Delete a story by ID
 * @route  DELETE /api/stories/:id
 * @access Private (admin / super-admin)
 */

export const deleteStory = async (req:Request, res:Response) =>{
    try {
        const {id} = req.params as {id: string};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid story ID format"
            })
        }

        const deleteStory = await Story.findByIdAndDelete(id);

        if (!deleteStory) {
            return res.status(404).json({
                message: "Story not found",
            })
        }
        return res.status(200).json({
            message: "Story deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting story", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    };
}

export default {
    createStory,
    getAllStories,
    updateStory,
    deleteStory
}