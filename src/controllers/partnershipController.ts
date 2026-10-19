import { Request, Response } from "express";
import PartnershipRequest from "../models/partnershipRequestModel.js";

/**
 * @desc    Submit a new partnership request
 * @route   POST /api/partnerships
 * @access  Public
 */
export const createPartnershipRequest = async (req: Request, res: Response) => {
    try {
        const { organisationName, contactPerson, email, howWouldYouLikeToPartner } = req.body;

        if (!organisationName || !contactPerson || !email || !howWouldYouLikeToPartner) {
            return res.status(400).json({
                message: "All fields (organisationName, contactPerson, email, howWouldYouLikeToPartner) are required",
            });
        }

        const newRequest = await PartnershipRequest.create({
            organisationName,
            contactPerson,
            email,
            howWouldYouLikeToPartner,
        });

        return res.status(201).json({
            message: "Partnership request submitted successfully",
            data: newRequest,
        });
    } catch (error: any) {
        console.error("Error creating partnership request", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        });
    }
};

/**
 * @desc    Get all partnership requests (Admin / Super Admin)
 * @route   GET /api/partnerships
 * @access  Private (admin, super-admin)
 */
export const getAllPartnershipRequests = async (_req: Request, res: Response) => {
    try {
        const requests = await PartnershipRequest.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Partnership requests fetched successfully",
            count: requests.length,
            data: requests,
        });
    } catch (error: any) {
        console.error("Error fetching partnership requests", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        });
    }
};

/**
 * @desc    Delete a partnership request by ID (Admin / Super Admin)
 * @route   DELETE /api/partnerships/:id
 * @access  Private (admin, super-admin)
 */
export const deletePartnershipRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedRequest = await PartnershipRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Partnership request not found",
            });
        }

        return res.status(200).json({
            message: "Partnership request deleted successfully",
            data: deletedRequest,
        });
    } catch (error: any) {
        console.error("Error deleting partnership request", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || String(error),
        });
    }
};

export default {
    createPartnershipRequest,
    getAllPartnershipRequests,
    deletePartnershipRequest,
};