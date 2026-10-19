import mongoose, { Schema, Model, Document } from "mongoose";

export interface IHomeImageItem {
    url: string;
    publicId?: string;
}

export interface IHomeImage extends Document {
    images: IHomeImageItem[];
    createdAt: Date;
    updatedAt: Date;
}

const HomeImageItemSchema = new Schema<IHomeImageItem>(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        publicId: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const HomeImageSchema: Schema<IHomeImage> = new Schema<IHomeImage>(
    {
        images: [HomeImageItemSchema],
    },
    {
        timestamps: true,
    }
);

export const HomeImage: Model<IHomeImage> = 
    mongoose.models.HomeImage || 
    mongoose.model<IHomeImage>("HomeImage", HomeImageSchema);

export default HomeImage;