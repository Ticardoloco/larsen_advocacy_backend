import { Router } from "express";
import {
  registerUser,
  registerAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserProfiles,
  updateUserProfile,
  suspendUser,
  updateUserRole,
  deleteUserProfile,
} from "../controllers/userController";
import { verifyToken, verifyRole } from "../middleware/authMiddleware";

// TODO: Import your actual authentication and role-checking middleware here
// import { verifyToken, verifyRole } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User and Admin registration and login endpoints
 *   - name: Users
 *     description: User profile and account management
 *   - name: Admin Management
 *     description: Administrative operations for managing users, roles, and suspensions
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a standard user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@larsen.org
 *               password:
 *                 type: string
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists or missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/register-admin:
 *   post:
 *     summary: Register an admin or super-admin account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@larsen.org
 *               password:
 *                 type: string
 *                 example: AdminPassword123!
 *               role:
 *                 type: string
 *                 enum: [admin, super-admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin account created successfully
 *       400:
 *         description: Invalid role or user already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/register-admin", registerAdmin);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user or admin account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@larsen.org
 *               password:
 *                 type: string
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Account is suspended
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@larsen.org
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get currently logged-in user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Get a specific user profile by ID (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target user ID
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile/:id", verifyToken, verifyRole("admin", "super-admin"), getUserProfile);

/**
 * @swagger
 * /api/users/profiles:
 *   get:
 *     summary: Get all user profiles (Admin / Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All user profiles fetched successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/profiles", verifyToken, verifyRole("super-admin"), getUserProfiles);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update currently logged-in user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Taiwo Egbeleke
 *               phoneNumber:
 *                 type: string
 *                 example: +2348012345678
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/profile", verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users/suspend/{id}:
 *   patch:
 *     summary: Suspend or unsuspend a user account (Admin / Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isSuspended
 *             properties:
 *               isSuspended:
 *                 type: boolean
 *                 example: true
 *               suspensionReason:
 *                 type: string
 *                 example: Violation of foundation guidelines
 *     responses:
 *       200:
 *         description: User suspension status updated successfully
 *       400:
 *         description: isSuspended must be a boolean value
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/suspend/:id", verifyToken, verifyRole("super-admin"), suspendUser);

/**
 * @swagger
 * /api/users/role/{id}:
 *   patch:
 *     summary: Update a user's role (Super Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, super-admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role specified
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/role/:id", verifyToken, verifyRole("super-admin"), updateUserRole);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete currently logged-in user's own profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/profile", verifyToken, deleteUserProfile);

/**
 * @swagger
 * /api/users/user/{id}:
 *   delete:
 *     summary: Delete any user account by ID (Admin / Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target user ID to delete
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/user/:id", verifyToken, verifyRole("super-admin"), deleteUserProfile);

export default router;