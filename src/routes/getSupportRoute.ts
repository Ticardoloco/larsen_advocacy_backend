import { Router } from "express";
import {
  createSupportRequest,
  getAllSupportRequests,
  deleteSupportRequest,
} from "../controllers/getSupportController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: GetSupport
 *   - description: Operations for managing user support requests and tickets
 */

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all support requests (Admin / Super Admin)
 *     tags: [GetSupport]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Support requests retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.get("/", verifyToken, verifyRole("admin", "super-admin"), getAllSupportRequests);

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Create a new support request (Public)
 *     tags: [GetSupport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - urgency
 *               - message
 *             properties:
 *               category:
 *                 type: string
 *                 example: Technical Issue
 *               urgency:
 *                 type: string
 *                 enum: [standard, high, critical]
 *                 example: high
 *               message:
 *                 type: string
 *                 example: I am unable to process my donation transaction on the platform.
 *               isAnonymous:
 *                 type: boolean
 *                 example: false
 *               fullName:
 *                 type: string
 *                 example: Taiwo Egbeleke
 *               email:
 *                 type: string
 *                 example: taiwo@example.com
 *               phone:
 *                 type: string
 *                 example: +2348012345678
 *     responses:
 *       201:
 *         description: Support request submitted successfully
 *       400:
 *         description: Category, urgency, and message are required fields / Invalid data
 *       500:
 *         description: Internal Server Error
 */
router.post("/", createSupportRequest);

/**
 * @swagger
 * /api/support/{id}:
 *   delete:
 *     summary: Delete a support request by ID (Super Admin)
 *     tags: [GetSupport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target support request ID to delete
 *     responses:
 *       200:
 *         description: Support Request deleted successfully
 *       400:
 *         description: Invalid support request format ID
 *       404:
 *         description: Support request not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("super-admin"), deleteSupportRequest);

export default router;