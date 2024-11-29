import mongoose from "mongoose";

export const MessageModel = mongoose.model(
    "messages", 
    new mongoose.Schema({
    user:String,
    message:String
    }));