import { CartService, ProductService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class ViewRouter extends MiRouter {

    init () {
        //<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Carrito>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/carts/:cid', ["USER", "PREMIUM"], async (req, res) => {
            try {
                
                let data = await CartService.getCartById(req.params.cid)
                
                let cart
                
                if (data.code == 200) {
                    cart = data.result.payload
                    cart.isValid = true
                    cart.totalPrice = 0
                    cart.totalProduct = 0
                    //obtine el valor del subtotal de cada producto
                    cart.products.forEach(prod => prod.subTotal = prod.product.price * prod.quantity)
                    //obtine el valor del total de los productos del carrito
                    cart.products.forEach(prod => cart.totalPrice = cart.totalPrice += prod.subTotal)
                    //obtine la cantidad de los productos del carrito
                    cart.products.forEach(prod => cart.totalProduct = cart.totalProduct += prod.quantity)
            
                    //se cambia de valor numerico una cadena en formato moneda MXN del precio, subtotal y total
                    //precio
                    cart.products.forEach(prod => prod.subTotal = Intl.NumberFormat('es-MX',
                        { style: 'currency', currency: 'MXN' }).format(prod.subTotal))
                    //subtotal
                    cart.products.forEach(prod => prod.product.price = new Intl.NumberFormat('es-MX',
                        { style: 'currency', currency: 'MXN' }).format(prod.product.price))
                    //total
                    cart.totalPrice = new Intl.NumberFormat('es-MX',
                        { style: 'currency', currency: 'MXN' }).format(cart.totalPrice)
            
                }
                
                res.render('cart/cart', {title: "Mi carrito", cart: cart, user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

        //<<<<<<<<<<<<<<<<<<<<<<<<<<Vista Chat>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/chat', ["USER", "PREMIUM"], async (req, res) => {
            try {
                
                res.render('chat', {title: "Chat", user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })
    }
}