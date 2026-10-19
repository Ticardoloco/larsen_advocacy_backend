import { Request, Response } from "express";
import FitTestResult from "../models/fitTestModel.js";

const ANSWER_KEY: number[] = [
  0, // Q1: A
  1, // Q2: B
  1, // Q3: B
  1, // Q4: B
  1, // Q5: B
  0, // Q6: A
  1, // Q7: B
  0, // Q8: A
  0, // Q9: A
  1, // Q10: B
  1, // Q11: B
  3, // Q12: D
  0, // Q13: A
  1, // Q14: B
  1, // Q15: B
  1, // Q16: B
  1, // Q17: B
  0, // Q18: A
  1, // Q19: B
  1, // Q20: B
  1, // Q21: B
  1, // Q22: B
  0, // Q23: A
  1, // Q24: B
  1, // Q25: B
];

/**
 * @desc    Submit and grade Child Protection Fit Test
 * @route   POST /api/fit-test/submit
 * @access  Public
 */

export const submitFitTest = async (req: Request, res: Response) => {
  try {
    const { fullName, email, answers } = req.body;
    if (!fullName || !email || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Full name, email, and an array of answers are required.",
      });
    }

    if (answers.length !== 25) {
        return res.status(400).json({
            message: "All 25 questions must be answered."
        });
    }

    let score = 0;
    answers.forEach((ansIndex, qIndex)=>{
        if(ansIndex === ANSWER_KEY[qIndex]){
            score++;
        }
    });

    const percentage = Math.round((score / 25) * 100);
    let categoryTitle = "";
    let dbStatus: "Champion" | "Protection Aware" | "Growing Learner" | "Needs Support";
    let backendTag = "";

    if (percentage >= 80) {
      categoryTitle = "CHILD PROTECTION CHAMPION";
      dbStatus = "Champion";
      backendTag = "PASS - Certified";
    } else if (percentage >= 60) {
      categoryTitle = "PROTECTION AWARE";
      dbStatus = "Protection Aware";
      backendTag = "CONDITIONAL PASS";
    } else if (percentage >= 50) {
      categoryTitle = "GROWING LEARNER";
      dbStatus = "Growing Learner";
      backendTag = "NEEDS TRAINING";
    } else {
      categoryTitle = "NEEDS SUPPORT";
      dbStatus = "Needs Support";
      backendTag = "FAIL - Requires Intervention";
    }

    const savedResult = await FitTestResult.create({
      fullName,
      email,
      score,
      totalQuestions: 25,
      percentage,
      status: dbStatus,
    });

    return res.status(201).json({
      message: "Fit test submitted and graded successfully",
      data: {
        fullName,
        score,
        total: 25,
        percentage,
        categoryTitle,
        backendTag,
        resultId: savedResult._id,
        isPrivate: percentage < 50, // True for Scenario D (private red card)
      },
    });

  } catch (error: any) {
    console.error("Error submitting fit test:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get all fit test submissions (Admin view)
 * @route   GET /api/fit-test/results
 * @access  Private (Admin)
 */
export const getAllFitTestResults = async (_req: Request, res: Response) => {
  try {
    const results = await FitTestResult.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Fit test results fetched successfully",
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error("Error fetching fit test results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
    submitFitTest,
    getAllFitTestResults
}
