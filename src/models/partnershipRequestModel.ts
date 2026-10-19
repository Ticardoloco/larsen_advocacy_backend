import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPartnershipRequest extends Document {
    organisationName: string;
    contactPerson: string;
    email: string;
    howWouldYouLikeToPartner: string;
    createdAt: Date;
    updatedAt: Date;
}

const PartnershipRequestSchema: Schema<IPartnershipRequest> = new Schema<IPartnershipRequest>(
    {
        organisationName: {
            type: String,
            required: [true, "Organisation name is required"],
            trim: true,
        },
        contactPerson: {
            type: String,
            required: [true, "Contact person name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            trim: true,
            lowercase: true,
        },
        howWouldYouLikeToPartner: {
            type: String,
            required: [true, "Details on how they would like to partner are required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PartnershipRequest: Model<IPartnershipRequest> = 
    mongoose.models.PartnershipRequest || 
    mongoose.model<IPartnershipRequest>("PartnershipRequest", PartnershipRequestSchema);

export default PartnershipRequest;