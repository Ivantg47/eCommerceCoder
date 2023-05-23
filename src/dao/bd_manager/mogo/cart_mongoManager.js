import { cartModel } from "./models/cart.model.js"
import product from "./product_mongoManager.js"

class CartMongoManager{

    constructor(){
    }

    getCarts = async() => {

        try{

            const cart = await cartModel.find().lean().exec()

            return cart

        } catch(error) {

            throw error

        }
    }

    getCartById = async(id) => {

        try{

            const cart = await cartModel.findOne({_id: id}).populate('products.product').lean().exec()

            return cart
        
        } catch(error) {

            throw error

        } 
    }
    
    addCart = async() => {

        try{

            const result = await cartModel.create({})
            
            return result
            
        } catch(error) {

            throw error

        }
    }
    
    deleteCart = async(id) => {
        try {
            
            const result = await cartModel.deleteOne({_id: id})
            
            return result

        } catch(error) {

            throw error

        }
    }

    updateCart = async(cid, prods) => {
        try {
            
            const result = await cartModel.findOneAndUpdate({_id: cid}, {'$set': { "products": prods}}, { upsert: true, returnOriginal: false })
            
            return result

        } catch (error) {
            
            throw error
        }
    }
    
    addProdCart = async(cid, pid, quantity) => {
        try{

            const prod = await product.getProductById(pid)
            
            if (!prod) {
                throw new Error('Product not Found')
            }
            const res = await cartModel.findOne({_id: cid, 'products.product': pid}, {"products.$": 1, "_id": 0}).lean().exec()
            let result
            if (res) {
                return result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$inc': {"products.$.quantity": quantity}}, { upsert: true, returnOriginal: false })
            } else {
                return result = await cartModel.findOneAndUpdate({_id: cid}, {'$push': { products: {product: pid, quantity: quantity}}}, { upsert: true, returnOriginal: false })
            }
            

        } catch(error) {

            throw error

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            
            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$pull': {products: {product: pid}}}).lean().exec()
            let prod = result.products.find(prod => prod.product == pid)
            
            return prod
            
        
        } catch(error) {
            
            throw error

        }
    }

    updateProdCart = async(cid, pid, quantity) => {
        try {
            
            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$set': {"products.$.quantity": quantity}}, { upsert: true, returnOriginal: false }).lean().exec()

            return result

        } catch (error) {
            
            throw error
            
        }
    }
}

const carrito = new CartMongoManager()

export default carrito
