import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protectRoute=async (req,res,next)=>{

    try {

        const token=req.cookies.jwt;

        if(!token) return res.status(401).json({message: "Unauthorized- no token provided"});


        const decoded=jwt.verify(token, process.env.JWT_sECRET_KEY);

        if(!decoded) return res.status(401).json({message: "Unauthorized - invalid token"})

        const user= await User.findById(decoded.userId).select("-password");

        if(!user) return res.status(401).json({message:"Unauthorized- user not found"});

        req.user=user;

        next();


    } catch (error) {
        console.log("error in protectRoute middleware",error);
        return res.status(501).json({message: "Internal Server error"});
        
    }
}