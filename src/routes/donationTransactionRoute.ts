import { Router } from "express";
import {
  initializeDonation,
  verifyDonation,
  getAllDonations,
  deleteDonationTransaction,
} from "../controllers/donationTransactionController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: DonationTransactions
 *   - description: Operations for processing and managing foundation donation payments via Bachs
 */

/**
 * @swagger
 * /api/donations/initialize:
 *   post:
 *     summary: Initialize a Bachs checkout session for NGN or USD donations
 *     tags: [DonationTransactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - donorName
 *               - email
 *               - amount
 *               - fund
 *             properties:
 *               donorName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               fund:
 *                 type: string
 *                 example: "omokunrinimi"
 *               currency:
 *                 type: string
 *                 example: "NGN"
 *                 description: Optional currency (defaults to NGN, supports NGN and USD)
 *     responses:
 *       201:
 *         description: Donation session initialized successfully
 *       400:
 *         description: Missing required fields, invalid JSON, or unsupported currency
 *       500:
 *         description: Internal Server Error
 */
router.post("/initialize", initializeDonation);

/**
 * @swagger
 * /api/donations/verify/{reference}:
 *   get:
 *     summary: Verify a Bachs donation transaction status by reference
 *     tags: [DonationTransactions]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique transaction reference returned during initialization
 *     responses:
 *       200:
 *         description: Donation verified and completed successfully
 *       400:
 *         description: Transaction reference is required or transaction failed/abandoned
 *       404:
 *         description: Transaction session not found on gateway or locally
 *       500:
 *         description: Internal Server Error
 */
router.get("/verify/:reference", verifyDonation);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donation transactions and totals broken down by currency (Admin / Super Admin)
 *     tags: [DonationTransactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Donation transactions fetched successfully with currency totals
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/",
  verifyToken,
  verifyRole("admin", "super-admin"),
  getAllDonations
);

/**
 * @swagger
 * /api/donations/{id}:
 *   delete:
 *     summary: Delete a donation transaction by MongoDB ID or reference (Admin / Super Admin)
 *     tags: [DonationTransactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId or custom reference of the transaction
 *     responses:
 *       200:
 *         description: Donation transaction deleted successfully
 *       400:
 *         description: ID or reference parameter is required
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRole("admin", "super-admin"),
  deleteDonationTransaction
);

export default router;