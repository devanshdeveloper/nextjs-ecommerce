import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

UserSchema.methods.addToCart = async function (productId, quantity = 1) {
  const existingProductIndex = this.cart.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (existingProductIndex >= 0) {
    this.cart[existingProductIndex].quantity = +quantity;
  } else {
    this.cart.push({ product: productId, quantity, variants });
  }
  await this.save();
  return this.cart;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
