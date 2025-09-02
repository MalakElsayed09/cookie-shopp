import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next){
const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
if(!token) return res.status(401).json({message:'Unauthorized'});
try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
catch { return res.status(401).json({message:'Invalid token'}); }
}
export function requireAdmin(req,res,next){
if(req.user?.role !== 'admin') return res.status(403).json({message:'Forbidden'});
next();
}