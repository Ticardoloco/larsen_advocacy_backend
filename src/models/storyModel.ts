import mongoose, {Schema, Model, Document} from "mongoose";

export interface IStory extends Document{
    year: string;
    title: string,
    body: string;
    createdAt: Date;
    updatedAt: Date;
}

const storySchema: Schema<IStory> = new Schema<IStory>(
    {
        year: {
            type: String,
            required: [true, "Year field is required"],
            trim: true,
        },

        title: {
            type: String,
            required: [true, "Title field is required"],
            trim: true
        },

        body: {
            type: String,
            required: [true, "Body field is required"],
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

export const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>("Story", storySchema);

export default Story;