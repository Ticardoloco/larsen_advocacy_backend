import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonationTransaction extends Document {
  donorName: string;
  email: string;
  amount: number;
  fund: "general" | "omokunrinimi" | "bank200" | "campaign";
  currency: "NGN" | "USD";
  reference: string;
  checkoutId?: string;
  status: "pending" | "success" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const donationTransactionSchema: Schema<IDonationTransaction> =
  new Schema<IDonationTransaction>(
    {
      donorName: {
        type: String,
        required: [true, "Donor name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email address is required"],
        lowercase: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: [true, "Donation amount is required"],
        min: [1, "Amount must be greater than zero"],
      },
      fund: {
        type: String,
        required: [true, "Fund selection is required"],
        enum: {
          values: ["general", "omokunrinimi", "bank200", "campaign"],
          message: "{VALUE} is not a valid fund category",
        },
        lowercase: true,
        trim: true,
      },
      currency: {
        type: String,
        required: [true, "Currency is required"],
        enum: ["NGN", "USD"],
        default: "NGN",
        uppercase: true,
        trim: true,
      },
      reference: {
        type: String,
        required: [true, "Payment reference is required"],
        unique: true,
        trim: true,
        index: true,
      },
      checkoutId: {
      type: String,
    },
      status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
        lowercase: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    },
  );

export const DonationTransaction: Model<IDonationTransaction> =
  mongoose.models.DonationTransaction ||
  mongoose.model<IDonationTransaction>(
    "DonationTransaction",
    donationTransactionSchema,
  );

export default DonationTransaction;
