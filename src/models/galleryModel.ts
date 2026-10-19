import mongoose, {Schema, Model, Document} from "mongoose";

export interface IGallery extends Document{
    caption: string;
    category: string;
    year: string;
    tone: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const gallerySchema: Schema<IGallery> = new Schema<IGallery>(
    {
        caption: {
            type: String,
            required: [true, "Caption field is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category field is required"],
            trim: true
        },
        year: {
            type: String,
            required: [true, "Year field is required"],
            trim: true
        },
        tone: {
            type: Number,
        },
        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema);
export default Gallery;