import mongoose, {Schema, Model, Document} from "mongoose";

export interface IDonate extends Document {
   slug: string;
   label: string;
   blurb: string;
   createdAt: Date;
   updatedAt: Date;
}

const donateSchema: Schema<IDonate> = new Schema<IDonate>(
   {
      slug: {
         type: String,
         required: [true, "Slug field is required"],
         trim: true
      },
      label: {
         type: String,
         required: [true, "Label field is required"],
         trim: true
      },
      blurb: {
         type: String,
         required: [true, "Blurb field is required"],
         trim: true
      }
   },
   {
      timestamps: true,
   }
)

export const Donate: Model<IDonate> = mongoose.models.Donate || mongoose.model<IDonate>("Donate", donateSchema);
export default Donate;