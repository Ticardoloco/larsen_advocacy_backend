import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProgram extends Document {
  slug: string;
  name: string;
  taglines: string;
  body: string[];
  category: string;
  ctas: string[];
  callout?: { title: string; body: string };
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema: Schema<IProgram> = new Schema<IProgram>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    taglines: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: [
        {
          type: String,
          trim: true, // 👈 Correctly placed inside the array definition
        },
      ],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    ctas: {
      type: [
        {
          type: String,
          trim: true, // 👈 Correctly placed inside the array definition
        },
      ],
      required: true,
    },
    callout: {
      type: {
        title: { type: String, trim: true },
        body: { type: String, trim: true },
      },
      required: false,
    },

    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Example inside your programModel.ts
programSchema.pre("save", function () {
  if (this.callout) {
    // If both title and body are empty strings, unset callout entirely
    if (!this.callout.title && !this.callout.body) {
      this.callout = undefined as any;
    }
  }
});

export const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>("Program", programSchema);
export default Program;
