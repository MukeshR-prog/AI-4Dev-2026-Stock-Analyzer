import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string;
  company: string;
  branch: string;
  role: string;
  isSetupComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    displayName: { type: String, default: "" },
    photoURL: { type: String, default: "" },
    company: { type: String, default: "" },
    branch: { type: String, default: "" },
    role: { type: String, default: "store_manager" },
    isSetupComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
