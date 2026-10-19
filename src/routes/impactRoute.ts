import { Router } from "express";
import {
  createImpact,
  getAllImparts,
  updateImpact,
  deleteImpact,
} from "../controllers/ImpactController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Impact
 *   - description: Operations for managing foundation impact metrics and statistics
 */

/**
 * @swagger
 * /api/impacts:
 *   get:
 *     summary: Get all impact metrics
 *     tags: [Impact]
 *     responses:
 *       200:
 *         description: Impact metrics fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllImparts);

/**
 * @swagger
 * /api/impacts:
 *   post:
 *     summary: Create a new impact metric (Admin / Super Admin)
 *     tags: [Impact]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - label
 *             properties:
 *               value:
 *                 type: number
 *                 example: 500
 *               suffix:
 *                 type: string
 *                 example: "+"
 *               label:
 *                 type: string
 *                 example: Children Reached
 *     responses:
 *       201:
 *         description: Impact metric created successfully
 *       400:
 *         description: Value and label are required fields
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), createImpact);

/**
 * @swagger
 * /api/impacts/{id}:
 *   put:
 *     summary: Update an existing impact metric by ID (Admin / Super Admin)
 *     tags: [Impact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target impact metric ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 example: 1000
 *               suffix:
 *                 type: string
 *                 example: "+"
 *               label:
 *                 type: string
 *                 example: Communities Impacted
 *     responses:
 *       200:
 *         description: Impact metric updated successfully
 *       400:
 *         description: Invalid impact ID format
 *       404:
 *         description: Impact metric not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), updateImpact);

/**
 * @swagger
 * /api/impacts/{id}:
 *   delete:
 *     summary: Delete an impact metric by ID (Admin / Super Admin)
 *     tags: [Impact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target impact metric ID to delete
 *     responses:
 *       200:
 *         description: Impact metric deleted successfully
 *       400:
 *         description: Invalid impact ID format
 *       404:
 *         description: Impact metric not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteImpact);

export default router;