import ProductDTO from '../DTO/product.dto.js'
import Mail from '../modules/mail.js'
import CustomError from '../services/errors/custom_error.js'
import EErrors from '../services/errors/enums.js'
import { generateProductErrorInfo } from '../services/errors/info.js'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage'
import storage from '../modules/storage.js'
import logger from '../utils/logger.js'

export default class ProductRepository {

    constructor (dao) {
        this.dao = dao
    }

    getProducts = async() => {
        try {

            const result = await this.dao.getProducts()

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            logger.error(error.message)

            return {code: 500, result: {status: "error", message: error.message, error: error}}

        }
    }

    getPaginate = async (query, pagination) => {
        try {

            const result = await this.dao.getPaginate(query, pagination)
            
            if (!result.isValid) {
                return {code: 404, result: {status: "error", error: 'Not found', payload: result}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {
            
            logger.error(error.message)

            return {code: 500, result: {status: "error", message: error.message, error: error}}
            
        }
    }

    getProductById = async(id) => {
        try {

            const result = await this.dao.getProductById(id)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            logger.error(error.message)

            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            
            return {code: 500, result: {status: "error", message: error.message, error: error}}

        }       
    }

    addProduct = async(prod, files) => {
        try {
            logger.debug("files")
            //console.log(files);
            if (!prod.title || !prod.description || !prod.price || !prod.code || !prod.stock || !prod.category) {
                
                CustomError.createError({
                    name: "Error de creación de producto",
                    cause: generateProductErrorInfo(prod),
                    message: "Error en la creación del poducto, uno o mas campos se encuentran vacios",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            logger.debug(files?.length)
            if(files?.length === 0 || !files) {
                prod.thumbnail = ['/img/noimage.jpg']
            } else {
                
                prod.thumbnail = await Promise.all(files.map(async (file) => {
                    console.log("ff: ",file);
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
                    const storageRef = ref(storage, `/img/products/${prod.title}-${uniqueSuffix}`)
                    const metadata = { contentType: file.mimetype, name: `${file.fieldname}-${uniqueSuffix}`}
                    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
                    
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    
                    return downloadURL
                    
                }))
            }

            const data = new ProductDTO(prod)

            const result = await this.dao.addProduct(data)
            
            return {code: 200, result: {status: "success", message: 'Producto creado', payload: result} }

        } catch (error) {
            //console.error(error)
            logger.error(error.message)

            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", message: error.message, error: error}}
            }

            return {code: 500, result: {status: "error", message: error.message, error: error}}

        }
    }

    deleteProduct = async(id) => {
        try {
            
            const result = await this.dao.deleteProduct(id)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            if (result.owner != 'admin') {
                
                const html = `<p>Apreciable Cliente,
                            <br><br>
                            Su producto "${result.title}" ha sido eliminada por el administrador.
                            <br><br>
                            Para cualquier duda estamos a su disposición.
                            <br><br>
                            Atentamente,
                            <br><br><br>
                            Equipo de Ecommerce
                            </p>`

                const mail = new Mail()
                
                mail.send(result.owner, 'Producto eliminado', html)
            }
            
            if (result.thumbnail[0] != '/img/noimage.jpg') {
                for (let i = 0; i < result.thumbnail.length; i++) {   
                    const fileUrl = result.thumbnail[i]    
                    const fileRef = ref(storage, fileUrl);
                    await deleteObject(fileRef)    
                }
            }

            return {code: 200, result: {status: "success", message: 'Producto eliminado', payload: result} }

        } catch (error) {

            logger.error(error.message)
            console.error(error);

            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", message: error.message, error: error}}
            

        }
    }

    updateProduct = async(pid, newProd) => {
        try {
            
            const result = await this.dao.updateProduct(pid, newProd)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto actualizado', payload: result} }

        } catch (error) {

            logger.error(error.message)
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            if (error.code === 66) {
                return {status: 400, error: 'El id no se pude modificar' }
            }

            if (error.name === 'MongoServerError' && error.code === 11000) {
                return {status: 400, error: 'Codigo en uso' }
            }

            return {code: 500, result: {status: "error", message: error.message, error: error}}

        }
    }

    purchase = async(pid, quantity) => {
        try {
            const result = await this.dao.purchase(pid, -quantity)
            
            return result

        } catch (error) {
            
            logger.error(error.message)

            return {code: 500, result: {status: "error", message: error.message, error: error}}

        }
    }

}