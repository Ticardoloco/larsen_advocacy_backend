import { Router } from "express";
import {
  createDonorMessage,
  getAllDonorMessage,
  updateDonorMessage,
  deleteDonorMessage,
} from "../controllers/donorMessageController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: DonorMessage
 *   - description: Operations for managing foundation donor messages and advice
 */

/**
 * @swagger
 * /api/donor-message:
 *   get:
 *     summary: Get all donor messages
 *     tags: [DonorMessage]
 *     responses:
 *       200:
 *         description: Donors message fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllDonorMessage);

/**
 * @swagger
 * /api/donor-message:
 *   post:
 *     summary: Create a new donor message (Admin / Super Admin)
 *     tags: [DonorMessage]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - donorName
 *               - message
 *               - advise
 *             properties:
 *               donorName:
 *                 type: string
 *                 example: John Doe
 *               message:
 *                 type: string
 *                 example: Keep up the incredible work supporting communities across Nigeria.
 *               advise:
 *                 type: string
 *                 example: Focus more on rural outreach expansions.
 *     responses:
 *       201:
 *         description: Donor message created successfully
 *       400:
 *         description: Donor name, message, and advice field are required
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), createDonorMessage);

/**
 * @swagger
 * /api/donor-message/{id}:
 *   put:
 *     summary: Update an existing donor message by ID (Admin / Super Admin)
 *     tags: [DonorMessage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target donor message ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorName:
 *                 type: string
 *                 example: Jane Doe
 *               message:
 *                 type: string
 *                 example: Updated message content here.
 *               advise:
 *                 type: string
 *                 example: Updated advice here.
 *     responses:
 *       200:
 *         description: Donor message updated successfully
 *       400:
 *         description: Invalid donor message ID format
 *       404:
 *         description: Donor message not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), updateDonorMessage);

/**
 * @swagger
 * /api/donor-message/{id}:
 *   delete:
 *     summary: Delete a donor message by ID (Admin / Super Admin)
 *     tags: [DonorMessage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target donor message ID to delete
 *     responses:
 *       200:
 *         description: Donor message deleted successfully
 *       400:
 *         description: Invalid donor message format ID
 *       404:
 *         description: Donor message not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteDonorMessage);

export default router;