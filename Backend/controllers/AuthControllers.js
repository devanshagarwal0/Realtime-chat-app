import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlink, unlinkSync} from "fs"
const maxAge=3*24*60*60*1000;
const createToken=(email,userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
}

export const signup=async(req,res,next)=>{
    try {
        const {email,password} =req.body;
        if(!email||!password){
            return res.status(400).send("Email and Password is required.");

        }
        const user=await User.create({email,password});
        res.cookie("jwt",createToken(email,user._id),{
            maxAge,
            secure:true,
            sameSite:"None",
            httpOnly: true, 
        });
        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,

            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const login=async(req,res,next)=>{
    try {
        const {email,password} =req.body;
        if(!email||!password){
            return res.status(400).send("Email and Password is required.");

        }
        const user=await User.findOne({email});

        if(!user){
            return res.status(404).send("User with given email id is not found");
        }
        const auth =await compare(password,user.password);
        if(!auth){
            return res.status(400).send("Password is incorrect.");
        }
        res.cookie("jwt",createToken(email,user._id),{
            maxAge,
            secure:true,
            sameSite:"None",
            httpOnly: true, 
        });
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}


export const getUserInfo= async (req,res)=>{
    try {
        const userdata = await User.findById(req.userId);

        if(!userdata){
            return res.status(404).send("user with the given id not found.");
        }
        return res.status(200).json({
                id:userdata.id,
                email:userdata.email,
                profileSetup:userdata.profileSetup,
                firstName:userdata.firstName,
                lastName:userdata.lastName,
                image:userdata.image,
                color:userdata.color,  
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal sever error");
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const {userId} =req;
        const {firstName, lastName, color}=req.body;
        if(!firstName||!lastName|| color===undefined){
            return res.status(404).send("First name, last name and color is required.");
        }
        const userdata = await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
        },{new:true,runValidators:true})
        return res.status(200).json({
                id:userdata.id,
                email:userdata.email,
                profileSetup:userdata.profileSetup,
                firstName:userdata.firstName,
                lastName:userdata.lastName,
                image:userdata.image,
                color:userdata.color,  
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal sever error");
    }
}



export const addProfileImage = async (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).send("File is Required.");
        }
        const date = Date.now();
        let fileName="uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser =await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});



        return res.status(200).json({
                image:updatedUser.image 
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal sever error");
    }
}



export const removeProfileImage = async (req,res)=>{
    try {
        const {userId} =req;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User not found");
        }
        if(user.image){
            unlinkSync(user.image);
        }
        user.image=null;
        await user.save();
        return res.status(200).send("Profile image removed succesfully");
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal sever error");
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"none"})
        return res.status(200).send("logout succesfully");
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal sever error");
    }
}