import { Router } from "express";
import {
  createStaff,
  getAllStaffs,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Staff
 *   - description: Operations for managing foundation staff and team member profiles
 */

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: Staff members fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllStaffs);

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member with an image upload (Super Admin)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - title
 *               - bio
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Jane Doe
 *               title:
 *                 type: string
 *                 example: Executive Director
 *               bio:
 *                 type: string
 *                 example: Jane has over 15 years of experience in public advocacy and community development...
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Staff profile image file
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *       400:
 *         description: Name, title, and bio are required fields or image file is missing
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("super-admin"), upload.single("image"), createStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update an existing staff member by ID with optional new image (Super Admin)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target staff member ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Jane Doe
 *               title:
 *                 type: string
 *                 example: Senior Director
 *               bio:
 *                 type: string
 *                 example: Updated biography details...
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement profile image file
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *       400:
 *         description: Invalid staff format ID
 *       404:
 *         description: Staff member not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("super-admin"), upload.single("image"), updateStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete a staff member by ID (Super Admin)
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target staff member ID to delete
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 *       400:
 *         description: Invalid staff format ID
 *       404:
 *         description: Staff member not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("super-admin"), deleteStaff);

export default router;