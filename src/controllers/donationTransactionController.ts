import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import DonationTransaction from "../models/donationTransactionModel.js";

/**
 * @desc    Initialize a Bachs donation checkout session (Supports NGN & USD)
 * @route   POST /api/donations/initialize
 * @access  Public
 */
export const initializeDonation = async (req: Request, res: Response) => {
  try {
    const {
      donorName,
      email,
      amount,
      fund,
      currency = "NGN",
      callback_url,
    } = req.body;

    if (!donorName || !email || !amount || !fund) {
      return res.status(400).json({
        message: "Donor name, email, amount, and fund are required fields",
      });
    }

    // Validate supported currencies
    const upperCurrency = currency.toUpperCase();

    if (!["NGN", "USD"].includes(upperCurrency)) {
      return res.status(400).json({
        message: "Unsupported currency. Only NGN and USD are allowed.",
      });
    }

    // Generate a unique reference for local tracking
    const reference = `DONATE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    // 1. Call Bachs Checkout Sessions API first
    const bachiBaseUrl = "https://sandbox-api.bachs.io/v1";
    const bachiResponse = await axios.post(
      `${bachiBaseUrl}/checkout-sessions`,
      {
        customer: {
          name: donorName,
          email,
        },
        pricing: {
          currency: upperCurrency,
          amount: Number(amount).toFixed(2),
        },
        reference,
        success_url:
          callback_url ||
          `${process.env.FRONTEND_URL}/donation/success?reference=${reference}`,
        cancel_url: `${process.env.FRONTEND_URL}/donation/cancel?reference=${reference}`,
        metadata: {
          donorName,
          fund,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BACHS_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const sessionData = bachiResponse.data.data || bachiResponse.data;
    console.log("🔍 Full Bachs Response:", JSON.stringify(sessionData, null, 2));

    // Extract Bachs' internal checkout ID
    const gatewayCheckoutId =
      sessionData.id || sessionData.checkout_id || sessionData.session_id;

    // 2. Create pending donation record in MongoDB with the Bachs checkoutId
    const newTransaction = await DonationTransaction.create({
      donorName,
      email,
      amount: Number(amount),
      fund,
      currency: upperCurrency,
      reference,
      checkoutId: gatewayCheckoutId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Donation session initialized successfully",
      data: {
        checkout_url:
          sessionData.checkout_url ||
          sessionData.url ||
          sessionData.authorization_url,
        reference,
        transaction: newTransaction,
      },
    });
  } catch (error: any) {
    console.error(
      "Error initializing Bachs donation:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Internal server error",
      error: error.response?.data?.message || error.message || String(error),
    });
  }
};

/**
 * @desc    Verify a Bachs donation transaction
 * @route   GET /api/donations/verify/:reference
 * @access  Public
 */
export const verifyDonation = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({
        message: "Transaction reference is required",
      });
    }

    // 1. Fetch local transaction record
    const transaction = await DonationTransaction.findOne({ reference });
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction record not found locally",
      });
    }

    // 2. Extract Bachs ID (fall back to reference if missing)
    const lookupId = transaction.checkoutId || reference;

    const bachiBaseUrl = "https://sandbox-api.bachs.io/v1";

    const bachiResponse = await axios.get(
      `${bachiBaseUrl}/checkout-sessions/${lookupId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BACHS_API_KEY}`,
        },
      },
    );

    const sessionData = bachiResponse.data.data || bachiResponse.data;
    const sessionStatus = sessionData.status || sessionData.payment_status;

    // 3. Status mapping check
    if (
      sessionStatus === "succeeded" ||
      sessionStatus === "completed" ||
      sessionStatus === "success" ||
      sessionStatus === "paid" ||
      sessionStatus === "SUCCEEDED"
    ) {
      const updatedTransaction = await DonationTransaction.findOneAndUpdate(
        { reference },
        { status: "success" },
        { returnDocument: "after" },
      );

      return res.status(200).json({
        message: "Donation verified and completed successfully",
        data: updatedTransaction,
      });
    } else {
      await DonationTransaction.findOneAndUpdate(
        { reference },
        { status: "failed" },
      );

      return res.status(400).json({
        message: "Transaction failed or was abandoned",
        status: sessionStatus,
      });
    }
  } catch (error: any) {
    console.error(
      "Error verifying Bachs donation:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Internal server error",
      error: error.response?.data?.message || error.message || String(error),
    });
  }
};

/**
 * @desc    Get all donation transactions (Admin / Super Admin view)
 * @route   GET /api/donations
 * @access  Private (Admin / Super Admin)
 */
export const getAllDonations = async (_req: Request, res: Response) => {
  try {
    const transactions = await DonationTransaction.find().sort({
      createdAt: -1,
    });

    const totalRaisedNGN = transactions
      .filter((d) => d.status === "success" && d.currency === "NGN")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalRaisedUSD = transactions
      .filter((d) => d.status === "success" && d.currency === "USD")
      .reduce((acc, curr) => acc + curr.amount, 0);

    return res.status(200).json({
      message: "Donation transactions fetched successfully",
      count: transactions.length,
      totals: {
        NGN: totalRaisedNGN,
        USD: totalRaisedUSD,
      },
      data: transactions,
    });
  } catch (error: any) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Delete a donation transaction by ID or reference (Admin / Super Admin)
 * @route   DELETE /api/donations/:id
 * @access  Private (Admin / Super Admin)
 */
export const deleteDonationTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as {id: string};

    if (!id) {
      return res.status(400).json({
        message: "Donation ID or reference parameter is required",
      });
    }

    // Support deletion by Mongo ObjectId OR by transaction reference string
    let deletedTransaction;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedTransaction = await DonationTransaction.findByIdAndDelete(id);
    } else {
      deletedTransaction = await DonationTransaction.findOneAndDelete({
        reference: id,
      });
    }

    if (!deletedTransaction) {
      return res.status(404).json({
        message: "Donation transaction not found",
      });
    }

    return res.status(200).json({
      message: "Donation transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error: any) {
    console.error("Error deleting donation transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};

export default {
  initializeDonation,
  verifyDonation,
  getAllDonations,
  deleteDonationTransaction,
};