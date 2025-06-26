import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Fuel } from "lucide-react";
import Email from "next-auth/providers/email";

const salt = await bcrypt.genSalt(10);

const invitationSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  notification: [invitationSchema],
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
