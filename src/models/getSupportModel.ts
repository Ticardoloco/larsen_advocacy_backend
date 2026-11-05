import mongoose, {Schema, Model, Document} from 'mongoose';

export interface IGetSupport extends Document {
    category: string;
    urgency: "standard" | "high" | "critical";
    message: string;
    isAnonymous: boolean;
    fullName?: string;
    email?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

const getSupportSchema: Schema<IGetSupport> = new Schema<IGetSupport>(
    {
        category: {
            type: String,
            required: true,
            trim: true
        },
        urgency: {
            type: String,
            enum: ["standard", "high", "critical"],
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        isAnonymous: {
            type: Boolean,
            required: true,
            default: false,
        },
        fullName: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        phone: {
            type: String
        }
    },

    {
        timestamps: true 
    }
);

export const GetSupport: Model<IGetSupport> = mongoose.models.GetSupport || mongoose.model<IGetSupport>("GetSupport", getSupportSchema);
export default GetSupport;