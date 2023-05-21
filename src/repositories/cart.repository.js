import CartDTO from '../DTO/cart.dto.js'
import { ProductService, TicketService } from "./index_repository.js"
import logger from '../utils/logger.js'
import Mail from '../modules/mail.js'
import { body, foot, head } from '../modules/html.js'

export default class CartRepository {

    constructor (dao) {
        this.dao = dao
    }

    getCarts = async () => {

        try {

            const result = await this.dao.getCarts()

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            result.forEach(prod => {
                if(prod?._id) prod.id = prod._id 
            });

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            logger.error(error.message);

        }
    }

    getCartById = async(id) => {
        try {

            const result = await this.dao.getCartById(id)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            if(result?._id) result.id = result._id

            return {code: 200, result: {status: "success", payload: result} }
            

        } catch (error) {
            logger.error(error.message);
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error.message}}

        }
    }

    addCart = async(cart) => {
        try {

            const data = new CartDTO(cart)
            const result = await this.dao.addCart(data)
            
            return {code: 200, result: {status: "success", message: 'Carrito creado', payload: result} }
            
        } catch (error) {
            
            return {code: 500, result: {status: "error", error: error}}

        }
    }

    deleteCart = async(id) => {
        try {

            const result = await this.dao.deleteCart(id)
            
            if (result.deletedCount === 0) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Carrito eliminado'} }
            

        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error}}

        }
    }

    updateCart = async(pid, newcart) => {
        try {
            const result = await this.dao.updateCart(pid, newcart)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }
            
        } catch (error) {
            logger.error(error.message);
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }

            return {code: 500, result: {status: "error", error: error.message}}

        }
    }

    addProdCart = async(cid, pid, quantity) => {
        try {
            quantity = Number(quantity) || 1

            const result = await this.dao.addProdCart(cid, pid, quantity)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto agregado', payload: result} }
            
        } catch (error) {
            logger.error(error.message);
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            
            return {code: 500, result: {status: "error", error: error.message}}

        }
    }

    deleteProdCart = async(cid, pid) => {
        try {
            const result = await this.dao.deleteProdCart(cid, pid)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", message: 'Producto eliminado'} }
            
        } catch (error) {
            
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            if (error.name === 'MongoServerError' && error.code === 2) {
                return {code: 400, result: {status: "error", error: 'El producto no se encuentra en el carrito'}}
            }
            return {code: 500, result: {status: "error", error: error.message}}
            
        }
    }

    updateProdCart = async(cid, pid, quantity) => {
        try {
            const result = await this.dao.updateProdCart(cid, pid, quantity)
            
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success",  message: 'Producto actualizado', payload: result} }
            
        } catch (error) {
            logger.error(error.message);
            if (error.name === 'CastError') {
                return {code: 400, result: {status: "error", error: 'Id invalido'}}
            }
            
            return {code: 500, result: {status: "error", error: error.message}}
            
        }
    }

    purchase = async(cid, usernanme) => {
        try {

            let data = await this.dao.getCartById(cid)

            if (!data) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
           
            const val = data.products.some(prod => {
                if (prod.product.stock >= prod.quantity) {
                    return true
                } 
            })
            
            if (!val) {
                return {code: 500, result: {status: "error", error: 'Los artículos seleccionados ya no se encuentran disponibles'}}
            }

            let ticket = {
                amount:0,
                purchaser: usernanme.email || 'no email'
            }

            const prods = []
            const cart = []
            
            data.products = data.products.filter((prod) => {

                if (prod.product.stock >= prod.quantity) {
                    
                    ticket.amount += prod.product.price * prod.quantity
                    
                    prods.push({id: prod.product.id || prod.product._id, quantity: prod.quantity, title: prod.product.title, price: prod.product.price, subtotal: prod.product.price * prod.quantity})
                        
                    return false

                } else {
                    cart.push({product: prod.product.id || prod.product._id, quantity: prod.quantity})
                    return true
                }
            })
            
            await Promise.all(prods.map(async prod => {return await ProductService.purchase(prod.id, prod.quantity)}))
            
            await this.updateCart(data.id || data._id, cart)
            
            const generateTicket = await TicketService.create(ticket)

            if (generateTicket) {
                
                generateTicket.amount = new Intl.NumberFormat('es-MX',
                        { style: 'currency', currency: 'MXN' }).format(generateTicket.amount)
                generateTicket.products = prods
                
                let html = head(`${usernanme.first_name} ${usernanme.first_name}`, generateTicket.code, generateTicket.purchase_datetime.toLocaleDateString())

                prods.forEach(prod => {
                    
                    html = html.concat(body(prod.title, prod.quantity, 
                                            new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(prod.price), 
                                            new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(prod.price * prod.quantity)
                                            )
                                        )

                });
                    
                html = html.concat(foot(generateTicket.amount))

                const mail = new Mail()
                
                mail.send(usernanme.email, "Confirmación de Compra", html)
                
                if (data.products.length === 0) {
                    return {code: 200, result: {status: "success", message: 'Compra realizada', payload: generateTicket} }
                }
    
                return {code: 200, result: {status: "partial", message: 'Algunos productos no pudieron ser procesados', payload: generateTicket, cart: data.products} }
                
            }

            return {code: 500, result: {status: "error", error: 'No se pudo procesar la compra'}}

        } catch (error) {

            logger.error(error.message);
            console.error(error);
            return {code: 500, result: {status: "error", error: error.message}}
            
        }
        
        
        
    }
}