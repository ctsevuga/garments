import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String},
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "client", "Unit Manager"],
      required: true,
      default: "Client",
    },
    phone: { type: String, required: true, unique: true },
    address: addressSchema, // single address
    resetOTP: String,
    resetOTPExpires: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
