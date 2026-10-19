import mongoose, {Schema, Model, Document} from "mongoose";

export interface IDonorMessage extends Document{
    donorName: string;
    message: string;
    advise: string;
    createdAt: Date;
    updatedAt: Date;
}

const DonorMessageSchema: Schema<IDonorMessage> = new Schema<IDonorMessage> (
    {
        donorName: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        advise: {
            type: String,
            required: true,
            trim: true,
        },
    },

    {
        timestamps: true,
    }
);

export const DonorMessage: Model<IDonorMessage> = mongoose.models.DonorMessage || mongoose.model<IDonorMessage>("DonorMessage", DonorMessageSchema);
export default DonorMessage;