import User from "../models/User.js"
import jwt from "jsonwebtoken"

//SignUp method
export async function signup(req,res){

    const {email, password, fullName}=req.body;

    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 Characters"})
        }
        //checking for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        //checking if user already exist with this email

        const existingUser=await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "Email already exists , please use a diffrent email"})
        }

        const idx=Math.floor(Math.random()*100)+1 //random number for avatar api

        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser=await User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar
        })


        //CREATE USER IN STREAM



        //creating a json web token

        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY, {expiresIn: '7d'})

        res.cookie("jwt",token,
            {
                maxage: 7*24*60*60*1000,
                httpOnly:true,
                sameSite:"strict",
                secure: process.env.NODE_ENV==="production"
        })

        res.status(201).json({success:true, user:newUser})

    }
    catch(error){
        console.log("error in signup controller");
        res.status(500).json({message: "internal server error"})
        
    }
}


//Login method
export async function login(req,res){

    try {
        const {email, password}=req.body;

        if(!email || !password)
            return res.status(400).json({message: "All fields required"})

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({message: "email or password invalid"});
        }

        const isPasswordCorrect= await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "invalid email or password"});
        }

        //sending back jwt after login
        const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, { expiresIn: "7d"});

        res.cookie("jwt", token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV=="production"
        });

        res.status(200).json({success: true, user});
        
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({message: "internal server error"}) 
    }
}


//Logout function
export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success :true, message: "logout successful"});
}

