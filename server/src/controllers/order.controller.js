import Order from '../models/Order.js';
export const createOrder = async (req,res)=>{
const { items } = req.body;
const subtotal = items.reduce((s,i)=> s + i.price * i.qty, 0);
const order = await Order.create({ user:req.user?.id, items, subtotal, status: 'paid' /* mock */});
res.status(201).json(order);
};
export const myOrders = async (req,res)=>{ const list = await Order.find({ user:req.user.id }).sort('-createdAt'); res.json(list); };
export const allOrders = async (_req,res)=>{ const list = await Order.find().sort('-createdAt'); res.json(list); };