import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const sign = (user) => jwt.sign({ id:user._id, role:user.role, name:user.name }, process.env.JWT_SECRET, { expiresIn:'7d' });


export async function register(req,res){
const { name,email,password } = req.body;
const exists = await User.findOne({ email }); if(exists) return res.status(409).json({ message:'Email in use' });
const user = await User.create({ name,email,password });
const token = sign(user);
res.cookie('token', token, { httpOnly:true, sameSite:'lax' }).json({ user:{ id:user._id, name:user.name, email:user.email } });
}
export async function login(req,res){
const { email,password } = req.body; const user = await User.findOne({ email });
if(!user || !(await user.comparePassword(password))) return res.status(401).json({ message:'Invalid credentials' });
const token = sign(user);
res.cookie('token', token, { httpOnly:true, sameSite:'lax' }).json({ user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
}
export async function me(req,res){
const user = await User.findById(req.user.id).select('-password');
res.json({ user });
}
export function logout(_req,res){ res.clearCookie('token').json({ ok:true }); }