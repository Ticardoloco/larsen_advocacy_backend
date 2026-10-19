import mongoose, {Schema, Model, Document} from "mongoose";

export type suffixType = "+" | "-" | "";
export interface IImpact extends Document {
    value: number;
    suffix: suffixType;
    label: string;
    createdAt: Date;
    updatedAt: Date;
}

const impartSchema: Schema<IImpact> = new Schema<IImpact>(
    {
        value: {
            type: Number,
            required: [true, "Value is required"],
        },
        suffix: {
            type: String,
            required: false,
            trim: true,
            enum: ["+", "-", ""],
            default: ""
        },
        label: {
            type: String,
            required: [true, "Label is required"],
            trim: true,
        }
    },
    {
        timestamps: true,
    }
)


export const Impart: Model<IImpact> = mongoose.models.Impart || mongoose.model<IImpact>("Impart", impartSchema)