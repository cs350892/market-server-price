import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name required"],
      trim: true,
      maxLength: [50, "name connot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
      default:
        "https://pixabay.com/vectors/user-little-man-icon-social-media-3331256/",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field
// for full user profile

userSchema.virtual("profileURL").get(function () {
  return {
    name: this.name,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
    role: this.role,
    lastActive: this.lastActive,
  };
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 11);
  next();
});

userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// genrate user password reset token

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(16).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 16 * 60 * 1000; // 16 mins
  return resetToken;
};

// update last active time for user
userSchema.methods.updateLastActive = async function () {
  this.lastActive = Date.now();
  await this.save({ validateBeforeSave: false });
};

export const User = mongoose.model("User", userSchema);
