import { CartService, ProductService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class ViewRouter extends MiRouter {

    init () {
        //<<<<<<<<<<<<<<<<<<<<<<<<<<Vistas Producto>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/', ["PUBLIC"], async (req, res) => {
            try {
                
                // logger.debug(req.session.user)
                // if (!req.session.user || req.user) {
                //     res.redirect('session/login')
                // } else {
            
                    let query = {}
                    let pagination = {
                        page: parseInt(req.query?.page) || 1,
                        limit: parseInt(req.query?.limit) || 10
                    }
                    const filter = req.query?.query || req.body?.query
                    const category = req.query?.category || req.body?.category
            
                    if(filter) query['title'] = {$regex: `(?i)${filter}(?i)`}
                    if(req.query.sort) pagination.sort = {price: req.query.sort}
                    if(req.query.category) query = {category: {$regex: `(?i)${category}(?i)`}}
                    if(req.query.status) query = {status: req.query.status}
                    
                    const result = await ProductService.getPaginate(query, pagination)
                    const prod = result.result.payload
                    
                    if (prod.isValid) {
                        prod.prevLink = prod.hasPrevPage ? `/?page=${prod.prevPage}` : ''
                        prod.nextLink = prod.hasNextPage ? `/?page=${prod.nextPage}` : ''
                        prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
                        { style: 'currency', currency: 'MXN' }).format(prod.price))
            
                        const pagination = []
            
                        for (let i = 1; i <= prod.totalPages; i++) {
                            pagination.push({
                                page: i,
                                active: i == prod.page
                            })
                        }
                        
                    }
                    
                    res.render('product/home', {title: "Products List", prod, query: filter, user: req.session?.user || req.user, pagination})
                // }

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

        this.get('/realtimeproducts', ["PUBLIC"], async (req, res) => {
            try {
                
                res.render('product/realTimeProducts', {title: "Products List", user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

        this.get('/products', ["PUBLIC"], async (req, res) => {
            try {
                
                let query = {}
                let pagination = {
                    page: parseInt(req.query?.page) || 1,
                    limit: parseInt(req.query?.limit) || 10
                }
                const filter = req.query?.query || req.body?.query
            
                if(filter) query = {title: {$regex: `/${filter}/i`}}
                if(req.query.sort) pagination.sort = {price: req.query.sort}
                if(req.query.category) query = {category: req.query.category}
                if(req.query.status) query = {status: req.query.status}
                
                let result = await ProductService.getPaginate(query, pagination)
                
                let prod = result.result.payload
                const index = []
    
                if (prod.isValid) {
                    prod.prevLink = prod.hasPrevPage ? `/products?page=${prod.prevPage}` : ''
                    prod.nextLink = prod.hasNextPage ? `/products?page=${prod.nextPage}` : ''
                    prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
                    { style: 'currency', currency: 'MXN' }).format(prod.price))
            
                    for (let i = 1; i <= prod.totalPages; i++) {
                        index.push({
                            page: i,
                            active: i == prod.page
                        })
                    }
                }
                
                res.render('product/product', {title: 'Catalogo', prod, query: filter, user: req.session?.user || req.user, pagination: index})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

        this.get('/products/:pid', ["PUBLIC"], async (req, res) => {
            try {
                
                const data = await ProductService.getProductById(req.params.pid)
                
                if (data.code !== 200) return res.status(404).render('error/general', {error: 'Product not found'})
                
                let prod = data.result.payload
            
                prod.price = new Intl.NumberFormat('es-MX',
                { style: 'currency', currency: 'MXN' }).format(prod.price)
            
                res.render('product/productD', {title: prod.title, data: prod, user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
            
        })

        this.get('/products/register', ["ADMIN", "PREMIUM", "PUBLIC"], async (req, res) => {
            try {
                
                res.render('product/registerProd', {title: 'Registrar nuevo producto', user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

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