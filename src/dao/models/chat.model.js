import mongoose from "mongoose";

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true, trim: true},
    message: { type: String, required: true, trim: true}
})

export const messageModel = mongoose.model(messageCollection, messageSchema)