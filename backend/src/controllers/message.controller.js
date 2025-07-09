import Message from "../models/message.modle.js"
import User from "../models/user.modle.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUsersForSidebar =async(req,res)=>{
    try {
        const loggedUserId=req.user._id
        const filteredUsers=await User.find({_id:{$ne:loggedUserId}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUserForSidebar",error.message)
        return res.status(500).json({error:"Internal Server Error"})
    }
}
export const getMessages=async(req,res)=>{
    try {
        const userChatId = req.params.id;
        const myId=req.user._id

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userChatId},
                {senderId:userChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getmessages  controller:",error.message)
        return res.status(500).json({error:"Internal Server Error"})
    }
}
export const sentMessages=async(req,res)=>{
    try {
        const {text,image}=req.body
        const {id:receiverId}=req.params
        const senderId=req.user._id

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }
        
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save()

        //todo: realtime functionality goes here =>socket.io
        const receiverSocketId=getReceiverSocketId[receiverId]
        if(receiverSocketId){
            io.to.emit(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in the sendMessage controller:",error.message)
        return res.status(500).json({message:"Internal server Error"})
    }
}