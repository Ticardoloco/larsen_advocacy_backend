import rateLimit from "express-rate-limit";

// 1. General limiter for standard API endpoints (e.g., 100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// 2. Strict limiter for Auth routes like login/register (e.g., 5 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed/total attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
});