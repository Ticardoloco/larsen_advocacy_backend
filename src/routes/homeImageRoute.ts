import { Router } from "express";
import multer from "multer";
import {
  getHomeImages,
  addHomeImage,
  deleteHomeImage,
} from "../controllers/homeImageController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: HomeImage
 *   - description: Operations for managing rotating homepage carousel and hero images
 */

/**
 * @swagger
 * /api/home-images:
 *   get:
 *     summary: Get all home rotating images
 *     tags: [HomeImage]
 *     responses:
 *       200:
 *         description: Home images fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getHomeImages);

/**
 * @swagger
 * /api/home-images:
 *   post:
 *     summary: Upload and add a new home image to the rotation (Admin / Super Admin)
 *     tags: [HomeImage]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload to Cloudinary
 *     responses:
 *       201:
 *         description: Image uploaded and added successfully
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error during upload
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), addHomeImage);

/**
 * @swagger
 * /api/home-images:
 *   delete:
 *     summary: Delete a home image by Cloudinary public ID (Admin / Super Admin)
 *     tags: [HomeImage]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: laef/home-carousel/abc123xyz
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Image publicId is required
 *       404:
 *         description: Image not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/", verifyToken, verifyRole("admin", "super-admin"), deleteHomeImage);

export default router;