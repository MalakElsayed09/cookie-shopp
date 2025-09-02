import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
name: { type: String, required: true },
slug: { type: String, required: true, unique: true },
description: String,
price: { type: Number, required: true },
calories: Number,
imageUrl: String,
tags: [String],
availableFrom: Date,
availableTo: Date,
isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);