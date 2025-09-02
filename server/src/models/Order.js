import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    slug:  { type: String, required: true },
    name:  { type: String, required: true },
    price: { type: Number, required: true },
    qty:   { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:    { type: [ItemSchema], required: true, validate: v => v.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    status:   { type: String, enum: ["paid", "pending", "cancelled"], default: "paid" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
