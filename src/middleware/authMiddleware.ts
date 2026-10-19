import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "FATAL ERROR: JWT_SECRET is not defined in the environment.",
    );
  }
  return secret;
};

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Access denied. No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, getJwtSecret()) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
};

export const verifyRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: User payload missing from request.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have the required permissions to perform this action.",
      });
    }
    next();
  };
};
