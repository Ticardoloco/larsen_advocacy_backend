import { Router } from "express";
import {
  createPartnershipRequest,
  getAllPartnershipRequests,
  deletePartnershipRequest,
} from "../controllers/partnershipController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Partnership
 *   - description: Operations for managing foundation partnership requests
 */

/**
 * @swagger
 * /api/partnerships:
 *   get:
 *     summary: Get all partnership requests (Admin / Super Admin)
 *     tags: [Partnership]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Partnership requests fetched successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.get("/", verifyToken, verifyRole("admin", "super-admin"), getAllPartnershipRequests);

/**
 * @swagger
 * /api/partnerships:
 *   post:
 *     summary: Submit a new partnership request (Public)
 *     tags: [Partnership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organisationName
 *               - contactPerson
 *               - email
 *               - howWouldYouLikeToPartner
 *             properties:
 *               organisationName:
 *                 type: string
 *                 example: Hope Community Initiative
 *               contactPerson:
 *                 type: string
 *                 example: Sarah Johnson
 *               email:
 *                 type: string
 *                 example: sarah@hopecommunity.org
 *               howWouldYouLikeToPartner:
 *                 type: string
 *                 example: We would like to bring a LAEF programme to our local school district.
 *     responses:
 *       201:
 *         description: Partnership request submitted successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post("/", createPartnershipRequest);

/**
 * @swagger
 * /api/partnerships/{id}:
 *   delete:
 *     summary: Delete a partnership request by ID (Admin / Super Admin)
 *     tags: [Partnership]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target partnership request ID to delete
 *     responses:
 *       200:
 *         description: Partnership request deleted successfully
 *       404:
 *         description: Partnership request not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deletePartnershipRequest);

export default router;