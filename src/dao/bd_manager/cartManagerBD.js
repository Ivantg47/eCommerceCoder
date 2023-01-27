import { cartModel } from "../models/cart.model.js"


class CartManager {

    constructor(){
    }

    getCarts = async() => {
        try{

            const cart = await cartModel.find().lean().exec()
            return cart

        } catch(error) {

            console.log(error);
            
        }
    }

    getCartById = async(id) => {
        try{
            
            const cart = await cartModel.findOne({_id: id}).populate('products.product').lean().exec()
            // console.log(JSON.stringify(cart, null, ' '));
            //console.log(cart);
            if (!cart) {
                return {status: 404, message: 'Not found'}
            }

            return {status: 200, message: cart}
        
        } catch(error) {

            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error);

        } 
    }
    
    addCart = async() => {
        try{

            const result = await cartModel.create({})
            //console.log(result);
            return {success: true, cart: result}
                    
        } catch(error) {

            console.log(error);

        }
    }
    
    deleteCart = async(id) => {
        try {
        
            const result = await cartModel.deleteOne(id)
    
            //console.log(result);
            if (result.deletedCount === 0) {
                return {status: 404, message: 'Not found'}
            }
            return {status: 200, message: 'Carrito eliminado'}
            
        } catch(error) {

            if (error.name === 'CastError') {
                return {status: 400, message: 'Id invalido'}
            }
            console.log(error)
            return error

        }
    }

    updateCart = async(cid, prods) => {
        try {
            if (!await cartModel.findOne({_id: cid})) {
                return {status: 404, message: 'Carrito no encontrado'}
            }

            const result = await cartModel.updateOne({_id: cid}, {'$push': { products: prods}})
            console.log(result);

            return {status: 200, message: 'Carrito modificado'}
        } catch (error) {
            console.log(error)
            return error
        }
    }
    
    addProdCart = async(cid, pid, body) => {
        try{
            // console.log(cid, pid);           
            //console.log(body.quantity);
            let quantity = Number(body.quantity) || 1
            //console.log(typeof quantity);

            if (!await cartModel.findOne({_id: cid})) {
                return {status: 404, message: 'Carrito no encontrado'}
            }
            const res = await cartModel.findOne({_id: cid, 'products.product': pid}, {"products.$": 1, "_id": 0}).lean().exec()
            //console.log(res);
            let result
            if (res) {
                result = await cartModel.updateOne({_id: cid, 'products.product': pid}, {'$set': {"products.$.quantity": res.products[0].quantity+quantity}})
            } else {
                result = await cartModel.updateOne({_id: cid}, {'$push': { products: {product: pid}}})
            }
            console.log(result);
            return {status: 200, message: 'Producto agregado'}

        } catch(error) {

            console.log(error);

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            if (!await cartModel.findOne({_id: cid})) {
                return {status: 404, message: 'Carrito no encontrado'}
            }
            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$pull': {products: {product: pid}}}).lean().exec()
            
            if (!result) {
                return {status: 404, message: 'Producto no encontrado'}
            } 

            return {status: 200, message: 'Producto eliminado'}
            
        
        } catch(error) {

            console.log(error);

        }
    }

    updateProdCart = async(cid, pid, prod) => {
        try {
            if (!await cartModel.findOne({_id: cid})) {
                return {status: 404, message: 'Carrito no encontrado'}
            }

            const result = await cartModel.findOneAndUpdate({_id: cid, 'products.product': pid}, {'$set': {"products.$.quantity": prod.quantity}}).lean().exec()

            if (!result) {
                return {status: 404, message: 'Producto no encontrado'}
            } 
            console.log(result);
            return {status: 200, message: 'Producto actualizado'}

        } catch (error) {
            console.log(error)
            return error
        }
    }

}

const carrito = new CartManager()

export default carrito
