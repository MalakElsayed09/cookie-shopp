import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
name: String,
price: Number,
qty: { type: Number, default: 1 }
});
const orderSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
items: [itemSchema],
subtotal: Number,
status: { type: String, enum: ['created','paid','fulfilled','cancelled'], default: 'created' }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);