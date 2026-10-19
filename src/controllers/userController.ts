import { Response, Request } from "express";
import User, { IAddress, UserGender } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error(
      "FATAL ERROR: JWT_SECRET is not defined in the environment.",
    );
  }
  return secret;
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
    });

    const token = jwt.sign({ userId: String(user._id) }, getJwtSecret(), {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
   console.error("Full Error Details:", error); // <-- Check your terminal for this log!
  return res.status(500).json({ 
    message: "Internal server error", 
    error: error.message || error 
  });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    if (!["admin", "super-admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified for admin registration",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash,
      role,
    });

    const { passwordHash: _passwordHash, ...userResponse } = newUser.toObject();
    return res.status(201).json({
      message: "Admin account created successfully",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        message: "Your account has been suspended. please contact support.",
        reason: user.suspensionReason || undefined,
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: String(user._id), email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    const { passwordHash: _passwordHash, ...userResponse } = user.toObject();

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;
    const targetUserId = req.params["id"]; // If an admin requests a specific user's ID

    if (!loggedInUser) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Determine whose profile to fetch: route param id (if admin) or own profile id
    let userIdToFetch = loggedInUser.userId;

    if (targetUserId) {
      if (!["admin", "super-admin"].includes(loggedInUser.role)) {
        return res.status(403).json({
          message: "Forbidden: You do not have permission to view other user profiles.",
        });
      }
      userIdToFetch = targetUserId;
    }

    const user = await User.findById(userIdToFetch).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getUserProfiles = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All user profiles fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

     if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { fullName, phoneNumber, address, gender } = req.body as {
      fullName?: string;
      phoneNumber?: string;
      address?: IAddress;
      gender?: UserGender;
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(fullName !== undefined && { fullName }),
          ...(phoneNumber !== undefined && { phoneNumber }),
          ...(address !== undefined && { address }),
          ...(gender !== undefined && { gender }),
        },
      },
      { returnDocument: "after", runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSuspended, suspensionReason } = req.body as {
      isSuspended: boolean;
      suspensionReason?: string;
    };

    if (typeof isSuspended !== "boolean") {
      return res
        .status(400)
        .json({ message: "isSuspended must be a boolean value" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSuspended = isSuspended;
    user.suspensionReason = isSuspended
      ? suspensionReason || "Violation of terms"
      : "";
    await user.save();
    const { passwordHash: _passwordHash, ...userResponse } = user.toObject();

    return res.status(200).json({
      message: isSuspended
        ? "User has been suspended"
        : "User has been unsuspended",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    const { role } = req.body as { role: "admin" | "super-admin" };

    const validRoles = ["admin", "super-admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    const { passwordHash: _passwordHash, ...userResponse } = user.toObject();

    return res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: userResponse,
    });
  }catch(error){
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

// 10. DELETE USER PROFILE (Self-delete or Admin delete)
export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;
    const targetUserId = req.params["id"]; // Passed via route params if an admin is deleting someone

    let userIdToDelete = loggedInUser?.userId;

    // If an ID was provided in the URL params, check if the requester is an admin/super-admin
    if (targetUserId) {
      if (!["admin", "super-admin"].includes(loggedInUser?.role)) {
        return res.status(403).json({
          message: "Forbidden: You do not have permission to delete other users.",
        });
      }
      userIdToDelete = targetUserId;
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete).select("-passwordHash");

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User account deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default {
  registerUser,
  registerAdmin,
  loginUser,
  logoutUser,
  suspendUser,
  getUserProfile,
  getUserProfiles,
  updateUserProfile,
  updateUserRole,
  deleteUserProfile
}