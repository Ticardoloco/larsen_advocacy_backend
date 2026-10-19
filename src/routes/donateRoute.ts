import { Router } from "express";
import {
  createDonate,
  getAllDonateFunds,
  getDonateBySlug,
  updateDonate,
  deleteDonate,
} from "../controllers/donateController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Donate
 *   - description: Operations for managing foundation donation causes and funds
 */

/**
 * @swagger
 * /api/donate:
 *   get:
 *     summary: Get all donate funds
 *     tags: [Donate]
 *     responses:
 *       200:
 *         description: Donate funds fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllDonateFunds);

/**
 * @swagger
 * /api/donate/{slug}:
 *   get:
 *     summary: Get a donate fund by slug
 *     tags: [Donate]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The target donate fund slug (e.g., general, omokunrinimi, bank200, campaign)
 *     responses:
 *       200:
 *         description: Donate fund fetched successfully
 *       404:
 *         description: Donate fund not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:slug", getDonateBySlug);

/**
 * @swagger
 * /api/donate:
 *   post:
 *     summary: Create a new donate fund (Admin / Super Admin)
 *     tags: [Donate]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *               - label
 *               - blurb
 *             properties:
 *               slug:
 *                 type: string
 *                 example: omokunrinimi
 *               label:
 *                 type: string
 *                 example: Sponsor Omokunrinimi
 *               blurb:
 *                 type: string
 *                 example: Support our community healthcare outreach initiative.
 *     responses:
 *       201:
 *         description: Donate fund created successfully
 *       400:
 *         description: Slug, label, and blurb field are required
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), createDonate);

/**
 * @swagger
 * /api/donate/{id}:
 *   put:
 *     summary: Update an existing donate fund by ID (Super Admin)
 *     tags: [Donate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target donate fund ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *                 example: general
 *               label:
 *                 type: string
 *                 example: General Donation Fund
 *               blurb:
 *                 type: string
 *                 example: Updated description for general foundation support.
 *     responses:
 *       200:
 *         description: Donate fund updated successfully
 *       400:
 *         description: Invalid donate fund format ID
 *       404:
 *         description: Donate fund not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("super-admin"), updateDonate);

/**
 * @swagger
 * /api/donate/{id}:
 *   delete:
 *     summary: Delete a donate fund by ID (Super Admin)
 *     tags: [Donate]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target donate fund ID to delete
 *     responses:
 *       200:
 *         description: Donate fund deleted successfully
 *       400:
 *         description: Invalid donate fund format ID
 *       404:
 *         description: Donate fund not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("super-admin"), deleteDonate);

export default router;