import { Router } from "express";
import {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
} from "../controllers/storyController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Stories
 *   - description: Operations for managing foundation success stories and timelines
 */

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: Stories fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllStories);

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create a new story (Admin / Super Admin)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - title
 *               - body
 *             properties:
 *               year:
 *                 type: string
 *                 example: "2025"
 *               title:
 *                 type: string
 *                 example: Empowering Rural Communities
 *               body:
 *                 type: string
 *                 example: We successfully launched outreach programs across 10 rural districts...
 *     responses:
 *       201:
 *         description: Story created successfully
 *       400:
 *         description: Year, title, body are required fields
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), createStory);

/**
 * @swagger
 * /api/stories/{id}:
 *   put:
 *     summary: Update an existing story by ID (Admin / Super Admin)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target story ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *                 example: "2026"
 *               title:
 *                 type: string
 *                 example: Expanded Youth Initiative
 *               body:
 *                 type: string
 *                 example: Updated description of the youth program achievements...
 *     responses:
 *       200:
 *         description: Story updated successfully
 *       400:
 *         description: Invalid story ID format
 *       404:
 *         description: Story not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), updateStory);

/**
 * @swagger
 * /api/stories/{id}:
 *   delete:
 *     summary: Delete a story by ID (Admin / Super Admin)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target story ID to delete
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *       400:
 *         description: Invalid story ID format
 *       404:
 *         description: Story not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteStory);

export default router;