// import { Router } from "express";
// import {
//   createProgram,
//   getAllPrograms,
//   getProgramByslug,
//   updateProgram,
//   deleteProgram,
// } from "../controllers/programController.js";
// import { upload } from "../middleware/uploadMiddleware.js";
// import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

// const router = Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Programs
//  *   - description: Operations for managing foundation programs and initiatives
//  */

// /**
//  * @swagger
//  * /api/programs:
//  *   get:
//  *     summary: Get all programs
//  *     tags: [Programs]
//  *     responses:
//  *       200:
//  *         description: Programs fetched successfully
//  *       500:
//  *         description: Internal Server Error
//  */
// router.get("/", getAllPrograms);

// /**
//  * @swagger
//  * /api/programs/{slug}:
//  *   get:
//  *     summary: Get a single program by slug or ID
//  *     tags: [Programs]
//  *     parameters:
//  *       - in: path
//  *         name: slug
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Program slug or MongoDB ObjectId
//  *     responses:
//  *       200:
//  *         description: Program fetched successfully
//  *       404:
//  *         description: Program not found
//  *       500:
//  *         description: Internal Server Error
//  */
// router.get("/:slug", getProgramByslug);

// /**
//  * @swagger
//  * /api/programs:
//  *   post:
//  *     summary: Create a new program with an image upload (Admin / Super Admin)
//  *     tags: [Programs]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - taglines
//  *               - image
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Youth Empowerment Initiative
//  *               taglines:
//  *                 type: string
//  *                 example: Building the next generation of leaders
//  *               body:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["Paragraph 1 details...", "Paragraph 2 details..."]
//  *               ctas:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["Register Now", "Learn More"]
//  *               callout:
//  *                 type: object
//  *                 properties:
//  *                   title:
//  *                     type: string
//  *                   body:
//  *                     type: string
//  *                 example: {"title": "Note", "body": "Applications close soon."}
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *                 description: Program feature image file
//  *     responses:
//  *       201:
//  *         description: Program created successfully
//  *       400:
//  *         description: Missing fields or image file required
//  *       401:
//  *         description: Not authorized
//  *       403:
//  *         description: Forbidden - Insufficient permissions
//  *       500:
//  *         description: Internal Server Error
//  */
// router.post("/", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), createProgram);

// /**
//  * @swagger
//  * /api/programs/{id}:
//  *   put:
//  *     summary: Update an existing program by ID with optional new image (Admin / Super Admin)
//  *     tags: [Programs]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The target program ID
//  *     requestBody:
//  *       required: false
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               taglines:
//  *                 type: string
//  *               body:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *               ctas:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *               callout:
//  *                 type: object
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *                 description: Optional replacement image file
//  *     responses:
//  *       200:
//  *         description: Program updated successfully
//  *       404:
//  *         description: Program not found
//  *       401:
//  *         description: Not authorized
//  *       403:
//  *         description: Forbidden - Insufficient permissions
//  *       500:
//  *         description: Internal Server Error
//  */
// router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), updateProgram);

// /**
//  * @swagger
//  * /api/programs/{id}:
//  *   delete:
//  *     summary: Delete a program by ID (Admin / Super Admin)
//  *     tags: [Programs]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The target program ID to delete
//  *     responses:
//  *       200:
//  *         description: Program deleted successfully
//  *       404:
//  *         description: Program not found
//  *       401:
//  *         description: Not authorized
//  *       403:
//  *         description: Forbidden - Insufficient permissions
//  *       500:
//  *         description: Internal Server Error
//  */
// router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteProgram);

// export default router;


import { Router } from "express";
import {
  createProgram,
  getAllPrograms,
  getProgramByslug,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Programs
 *   - description: Operations for managing foundation programs and initiatives
 */

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: Programs fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllPrograms);

/**
 * @swagger
 * /api/programs/{slug}:
 *   get:
 *     summary: Get a single program by slug or ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Program slug or MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Program fetched successfully
 *       404:
 *         description: Program not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:slug", getProgramByslug);

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Create a new program with an image upload (Admin / Super Admin)
 *     tags: [Programs]
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
 *               - taglines
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Youth Empowerment Initiative
 *               taglines:
 *                 type: string
 *                 example: Building the next generation of leaders
 *               category:
 *                 type: string
 *                 example: Education
 *               body:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paragraph 1 details...", "Paragraph 2 details..."]
 *               ctas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Register Now", "Learn More"]
 *               callout:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   body:
 *                     type: string
 *                 example: {"title": "Note", "body": "Applications close soon."}
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Program feature image file
 *     responses:
 *       201:
 *         description: Program created successfully
 *       400:
 *         description: Missing fields or image file required
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.post("/", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), createProgram);

/**
 * @swagger
 * /api/programs/{id}:
 *   put:
 *     summary: Update an existing program by ID with optional new image (Admin / Super Admin)
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target program ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Youth Empowerment Initiative
 *               taglines:
 *                 type: string
 *                 example: Updated tagline text
 *               category:
 *                 type: string
 *                 example: Community Development
 *               body:
 *                 type: array
 *                 items:
 *                   type: string
 *               ctas:
 *                 type: array
 *                 items:
 *                   type: string
 *               callout:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement image file
 *     responses:
 *       200:
 *         description: Program updated successfully
 *       404:
 *         description: Program not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", verifyToken, verifyRole("admin", "super-admin"), upload.single("image"), updateProgram);

/**
 * @swagger
 * /api/programs/{id}:
 *   delete:
 *     summary: Delete a program by ID (Admin / Super Admin)
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target program ID to delete
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *       404:
 *         description: Program not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyRole("admin", "super-admin"), deleteProgram);

export default router;