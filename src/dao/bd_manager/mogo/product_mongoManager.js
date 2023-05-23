import logger from '../../../utils/logger.js'
import { productModel } from './models/product.model.js'
import mongoose from 'mongoose'

class ProductMongoManager{

    constructor(){
        
    }

    getProducts = async () => {
        try {
            
            const data = await productModel.find().lean().exec()

            return data

        } catch (error) {
            
            throw error

        }
    }

    getPaginate = async (query, pagination) => {

        try{
            pagination.lean = true

            const data = await productModel.paginate(query, pagination)
            console.log(data);
            const prods = {
                isValid: !(data.page <= 0 || data.page>data.totalPages || data.docs.length === 0),
                totalProds: data.totalDocs,
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage, 
                page: data.page, 
                hasPrevPage: data.hasPrevPage, 
                hasNextPage: data.hasNextPage
            }
            
            return prods

        } catch(error) {
            
            throw error

        }
    }

    getProductById = async(id) => {

        try{
            
            const data = await productModel.findOne({_id: mongoose.Types.ObjectId(id)}).lean().exec()
            
            return data
        
        } catch(error) {
            
            throw error

        }    
    }

    addProduct = async(prod) => {

        try{
            
            const result = await productModel.create(prod)
            
            return result

        } catch(error) {
            
            throw error
            
        }    
    }

    deleteProduct = async(id) => {

        try{

            const prod = await this.getProductById(id)

            if (!prod) {
                return null
            }

            const result = await productModel.deleteOne({_id: id})
            
            if (result.deletedCount !== 0) {
                return prod
            }

            return null
        
        } catch(error) {
            
            throw error

        }                            
    }

    updateProduct = async(pid, newProd) => {

        try{
            const result = await productModel.findOneAndUpdate({_id: id}, newProd, { upsert: true, returnOriginal: false })
            
            return result
        
        } catch(error) {
            
            throw error

        }                        
    }

    purchase = async(pid, quantity) => {
        try {
            
            const result = await productModel.findOneAndUpdate({_id: pid}, {'$inc': {"stock": quantity}}, { upsert: true, returnOriginal: false })
            
            return result

        } catch (error) {
            
            throw error

        }
    }

}

const producto = new ProductMongoManager()

export default producto
