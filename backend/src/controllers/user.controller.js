import { messageSetPagination } from "stream-chat/dist/types/utils.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"

export async function getRecommendedUsers(req , res){

    try {
        
        const currentUserId=req.user.id;
        const currentUser=req.user;

        const recommendedUsers= await User.find({
            $and:[
                {_id: {$ne: currentUserId}},//exclude current user
                {$id: {$nin: currentUser.friends}}, //exclude current user friends
                { isOnboarded: true}
            ],
        });


        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("error in getRecommendedUsers controller", error);
        res.status(500).json({message: "Internal Server error"});
    }
}


export async function getMyFriends(req, res){

    try {
        const user=await User.findById(req.user.id).select("friends")
        .populate("friends","fullName learningLanguage nativeLanguage profilePic")


        res.status(200).json(user.friends);
        
    } catch (error) {
        console.log("error in getMyFriends controller", error);
        res.status(500).json("Interval Server Error");
    }

}


export async function sendFriendRequest(req, res) {
    
    try {
        
        const myId=req.user.id;
        const {id: recipientId}=req.params;

        //prevent yourself from sending request to yourself
        if(myId==recipientId) {
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }

        //if recipeint does not exist
        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"User Not found"});
        }

        //if sender and reciver are already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"you are already firends with user"});
        }

        //if a request already exists
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId, recevier:recipientId},
                {sender:recipientId, recevier:myId}
            ]
        });

        if(existingRequest){
            return res.status(400).json({message: "a friend request already exist between you and this user"});
        }

        const friendRequest=await FriendRequest.create({
            sender:myId,
            recevier:recipientId
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.log("error in sendfriendRequest controller", error);
        res.status(500).json({message:"Internal sErver Error"});
    }
}