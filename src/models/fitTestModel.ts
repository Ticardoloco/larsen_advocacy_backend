import mongoose, {Schema, Model, Document} from "mongoose";
export interface IFitTestResult extends Document{
    fullName: string;
    email: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    status: "Champion" | "Protection Aware" | "Growing Learner" | "Needs Support";
    createdAt: Date;
    updatedAt: Date;
}

const FitTestResultSchema: Schema<IFitTestResult> = new Schema<IFitTestResult>(
    {
        fullName:{
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
            default: 25,
        },
        percentage:{
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Champion", "Protection Aware", "Growing Learner", "Needs Support"],
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const FitTestResult: Model<IFitTestResult> = mongoose.models.FitTestResult || mongoose.model<IFitTestResult>("FitTestResult", FitTestResultSchema);
export default FitTestResult;