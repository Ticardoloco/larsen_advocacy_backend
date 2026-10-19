import mongoose, { Schema, Model, Document, } from "mongoose";

export type UserRole = "admin" | "super-admin";
export type UserGender = "male" | "female" | "other";
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}


export interface IUser extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender?: UserGender;
    passwordHash: string;
    role: UserRole;
    isSuspended: boolean;
    suspensionReason?: string;
    address?: IAddress;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        fullName: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            required: true, 
            unique: true,
            lowercase: true
        },

        phoneNumber: {
            type: String,
            trim: true
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "super-admin"],
            default: "admin",
       },

       isSuspended: {
            type: Boolean,
            default: false
       },

       suspensionReason: {
            type: String,
            trim: true,
            default: "",
        },

        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            zipCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },

        resetPasswordToken: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;