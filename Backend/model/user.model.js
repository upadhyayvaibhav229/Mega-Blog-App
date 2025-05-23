import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // ✅ Added missing import

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpiredAt: {
    type: Number,
    default: 0,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpiredAt: {
    // ✅ Fixed typo
    type: Number,
    default: 0,
  },
  refreshToken: {
    type: String,
  },
});

// ✅ Password encryption before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Password comparison method
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  if (!enteredPassword || !this.password) {
    console.error("Missing password during comparison", {
      enteredPassword,
      storedPassword: this.password,
    });
    return false;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: `${this.firstName} ${this.lastName}`, // ✅ Dynamically build fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPRIY,
    }
  );
};

// ✅ Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
