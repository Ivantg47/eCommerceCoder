import mongoose from "mongoose";

const userCollection = 'users' 

const userSchema = new mongoose.Schema({
    first_name: { type: String, trim: true},
    last_name: { type: String, trim: true},
    email:{ type: String, unique: true},
    password: { type: String, trim: true},
    method: String 
})

export const userModel = mongoose.model(userCollection, userSchema)