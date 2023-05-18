import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
import CustomError from "../../../../services/errors/custom_error.js";
import EErrors from "../../../../services/errors/enums.js";

const productCollection = 'products' //products

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    price:{ type: Number, required: true},
    thumbnail: [{type: String}],
    code: { type: String, required: true, trim: true, unique: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true, trim: true},
    status: {type:Boolean, default: true},
    owner: { type: String, trim: true}
})

productSchema.post('save', function(error, doc, next) {
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(CustomError.createError({
            name: "Error de creación de producto",
            cause: `El codigo proporcionado "${error.keyValue.code}", ya se encuentra en uso`,
            message: "Error en la creación del poducto, el codigo del producto ya se encuentra en uso",
            code: EErrors.INVALID_TYPES_ERROR
        }))
    } else {
        next();
    }

});


productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)