import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  age?: number;
  language?: string;
  gender?: string;
  avatar?: string;
  firebaseUid?: string;
  createdAt: Date;
  updatedAt: Date;
  authProvider?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    password: { type: String, required: true },

    age: { type: Number },

    language: { type: String },

    gender: { type: String },

    avatar: { type: String }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
