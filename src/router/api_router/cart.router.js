import { CartService, ProductService } from "../../repositories/index_repository.js";
import MiRouter from "../router.js";
import nodemailer from 'nodemailer'
import __dirname from "../../utils.js";
import config from "../../config/config.js";

export default class CartRouter extends MiRouter {

    init () {
        this.get('/', ["ADMIN"], async (req, res, next) => {
            try {
                const cart = await CartService.getCarts()

                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
            }
        })

        this.get('/:cid', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.getCartById(cid)
                
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.post('/', ["PUBLIC"], async (req, res, next) => {
            try {
                const cart = await CartService.addCart()
                
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.delete('/:cid', ["ADMIN"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.deleteCart(cid)

                return res.status(cart.code).send(cart.result)

            } catch(error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.put('/:cid', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                const { cid } = req.params
                const cart = await CartService.updateCart(cid, req.body)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.post('/:cid/product/:pid', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params
                const { quantity } = req.body
                
                if (req.session.user?.role == 'premium' || req.user?.role == 'premium') {
                    const p = await ProductService.getProductById(pid)
                    const email = req.session.user?.email || req.user?.email
                    if (p.result.payload.owner == email) {
                        req.logger.debug('El producto no puede ser adquirido por el propietario')
                        return res.status(403).send({status: "error", message: 'El producto no puede ser adquirido por el propietario'})
                    }
                }
                const cart = await CartService.addProdCart(cid, pid, quantity)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.delete('/:cid/product/:pid', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params
                
                const cart = await CartService.deleteProdCart(cid, pid)
            
                return res.status(cart.code).send(cart.result)

            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.put('/:cid/product/:pid', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                const { cid, pid } = req.params
                const { quantity } = req.body

                const cart = await CartService.updateProdCart(cid, pid, quantity)
            
                return res.status(cart.code).send(cart.result)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.get('/:cid/purchase', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                
                const { cid } = req.params
                const user = req.session?.user || req?.user
                
                const cart = await CartService.purchase(cid, user)
                
                if (cart.code == 200) {
                    
                    cart.result.payload.code2 = cart.result.payload.code
                    cart.result.payload.amount2 = cart.result.payload.amount

                    if (cart.result.status == "success") {  
                        return res.status(cart.code).render('cart/compra', {title: 'Confirmación de Compra', user: user, ticket: cart.result.payload})
                    }

                    return res.status(cart.code).render('cart/compra', {title: 'Confirmación de Compra', user: user, ticket: cart.result.payload, cart: cart.result.cart})
                    
                }
                return res.status(cart.code).render('error/general', {title: 'Confirmación de Compra', user: user, error: "Los artículos seleccionados, ya no se encuentran disponibles"})

            } catch (error) {
                req.logger.error(error.message);
                res.sendServerError(cart.result.error)
                return next()
            }
        })

    }
}