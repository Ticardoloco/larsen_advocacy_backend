import { Router } from "express";
import {
  submitFitTest,
  getAllFitTestResults,
} from "../controllers/fitTestController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: FitTest
 *   - description: Operations for managing and grading the Child Protection Fit Test
 */

/**
 * @swagger
 * /api/fit-test/submit:
 *   post:
 *     summary: Submit and grade the Child Protection Fit Test
 *     tags: [FitTest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - answers
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Tolu"
 *               email:
 *                 type: string
 *                 example: "tolu@example.com"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 3, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]
 *                 description: Array of 25 numerical answer index choices (0 for A, 1 for B, 2 for C, 3 for D)
 *     responses:
 *       201:
 *         description: Fit test submitted and graded successfully
 *       400:
 *         description: Missing required fields or incomplete answers (must be 25)
 *       500:
 *         description: Internal Server Error
 */
router.post("/submit", submitFitTest);

/**
 * @swagger
 * /api/fit-test/results:
 *   get:
 *     summary: Get all child protection fit test results (Admin / Super Admin)
 *     tags: [FitTest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fit test results fetched successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/results",
  verifyToken,
  verifyRole("admin", "super-admin"),
  getAllFitTestResults
);

export default router;