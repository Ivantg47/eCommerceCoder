import mongoose from "mongoose";

const userCollection = 'users' 

const userSchema = new mongoose.Schema({
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    email:{ type: String, unique: true },
    password: { type: String, trim: true },
    age:{ type: Date, trim: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts', default: null
    },
    role:{ type: String, trim: true, default: 'user' },
    method: { type: String, trim: true },
    documents: [{
        name: { type: String, trim: true },
        reference: { type: String, trim: true }
    }], default: [],
    last_connection: { type: String, trim: true, default: null }
})

export const userModel = mongoose.model(userCollection, userSchema)