import mongoose from "mongoose";
const shoppingItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ShoppingItem", shoppingItemSchema);
