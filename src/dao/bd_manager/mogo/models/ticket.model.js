import mongoose from "mongoose";

const ticketCollection = 'tickets' 

const ticketSchema = new mongoose.Schema({
    code: { type: String },
    purchase_datetime: { type: Date },
    amount:{ type: String },
    purchaser: { type: String, trim: true } //correo usuario
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)