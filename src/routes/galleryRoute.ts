import { Router } from "express";
import {
  createGallery,
  getAllGalleryItems,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Gallery
 *   - description: Operations for managing foundation gallery items and media
 */

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Gallery items fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllGalleryItems);

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery item with an image upload (Admin / Super Admin)
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - caption
 *               - category
 *               - year
 *               - image
 *             properties:
 *               caption:
 *                 type: string
 *                 example: Community outreach program in session
 *               category:
 *                 type: string
 *                 example: Outreach
 *               year:
 *                 type: string
 *                 example: "2026"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gallery image file
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *       400:
 *         description: Caption, category, year, or image file is required
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), createGallery);

/**
 * @swagger
 * /api/gallery/{id}:
 *   put:
 *     summary: Update an existing gallery item by ID with optional new image (Admin / Super Admin)
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target gallery item ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *                 example: Updated caption description
 *               category:
 *                 type: string
 *                 example: Education
 *               year:
 *                 type: string
 *                 example: "2026"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement gallery image file
 *     responses:
 *       200:
 *         description: Gallery item updated successfully
 *       400:
 *         description: Invalid gallery ID format
 *       404:
 *         description: Gallery item not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), updateGallery);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery item by ID (Admin / Super Admin)
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target gallery item ID to delete
 *     responses:
 *       200:
 *         description: Gallery item deleted successfully
 *       400:
 *         description: Invalid gallery ID format
 *       404:
 *         description: Gallery item not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteGallery);

export default router;