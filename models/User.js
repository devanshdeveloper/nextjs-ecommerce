import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { areVariantsEqual } from "@/utils/areVariantsEqual";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
  },
  isEmailVerified: { type: Boolean, default: false },
  password: {
    type: String,
    required: function () {
      return this.provider === "email";
    },
    minLength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variants: [
        {
          name: { type: String },
          value: { type: String },
        },
      ],
      quantity: Number,
    },
  ],
  provider: {
    type: String,
    default: "email",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  if (this.provider === "email") {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

UserSchema.methods.addToCart = async function (
  productId,
  quantity = 1,
  variants
) {
  const existingProductIndex = this.cart.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      areVariantsEqual(item.variants, variants)
  );

  const newQuantity = +quantity < 0 ? 1 : +quantity;

  if (existingProductIndex >= 0) {
    if (newQuantity === 0) {
      this.cart = this.cart.filter(
        (item) =>
          item.product.toString() !== productId.toString() ||
          !areVariantsEqual(item.variants, variants)
      );
      await this.save();
      return this.cart;
    }
    this.cart[existingProductIndex].quantity = newQuantity;
  } else {
    this.cart.push({
      product: productId,
      quantity: newQuantity,
      variants: Object.keys(variants).map((variantKey) => ({
        name: variantKey,
        value: variants[variantKey],
      })),
    });
  }
  await this.save();
  return this.cart;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
