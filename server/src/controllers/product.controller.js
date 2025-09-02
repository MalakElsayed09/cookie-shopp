import Product from '../models/Product.js';
export const list = async (req,res)=>{ const q = {}; // add filters later
const items = await Product.find(q).sort({ isFeatured:-1, createdAt:-1 }); res.json(items);
};
export const getOne = async (req,res)=>{ const p = await Product.findOne({ slug:req.params.slug }); if(!p) return res.status(404).json({}); res.json(p);
};
export const create = async (req,res)=>{ const p = await Product.create(req.body); res.status(201).json(p); };
export const update = async (req,res)=>{ const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true }); res.json(p); };
export const remove = async (req,res)=>{ await Product.findByIdAndDelete(req.params.id); res.json({ ok:true }); };