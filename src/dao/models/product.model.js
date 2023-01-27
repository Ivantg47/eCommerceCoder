import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products' //products

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    price:{ type: Number, required: true},
    thumbnail: [{type: String}],
    code: { type: String, required: true, trim: true, unique: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true, trim: true},
    status: {type:Boolean, default: true}
})

productSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next({success: false, message: 'Codigo en uso'});
    } else {
        next();
    }
});


productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)