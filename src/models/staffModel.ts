import mongoose, {Schema, Model, Document} from "mongoose";

export interface IStaff extends Document {
    name: string;
    title: string;
    bio: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const staffSchema: Schema<IStaff> = new Schema<IStaff>(
    {
        name: {
            type: String,
            required: [true, "Name field is required"],
            trim: true,
        },

        title: {
            type: String,
            required: [true, "Title field is required"],
            trim: true,
        },

        bio: {
            type: String,
            required: [true, "Bio field is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "image field is required"]
        }
    },
    {
        timestamps: true,
    }
)

export const Staff: Model<IStaff> = mongoose.models.Staff || mongoose.model<IStaff>("Staff", staffSchema);
export default Staff;

