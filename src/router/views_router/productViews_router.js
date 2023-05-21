import { ProductService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class ProductViewRouter extends MiRouter {

    init () {
        
        this.get('/products', ["PUBLIC"], async (req, res) => {
            try {

                const result = await ProductService.getProducts()
                const prod = {
                    isValid: result.code == 200,
                    payload: result.result.payload
                }
                
                if (prod.isValid) {
        
                    prod.payload.forEach(prod => prod.price = new Intl.NumberFormat('es-MX',
                    { style: 'currency', currency: 'MXN' }).format(prod.price))
        
                }
                
                res.render('product/home', {title: "Products List", prod, user: req.session?.user || req.user})

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

        this.get('/', ["PUBLIC"], async (req, res) => {
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
                
                if (data.code !== 200) return res.status(404).render('error/general', {error: 'Product not found', title: 'Error', user: req.session?.user || req.user})
                
                let prod = data.result.payload
            
                prod.price = new Intl.NumberFormat('es-MX',
                { style: 'currency', currency: 'MXN' }).format(prod.price)
            
                res.render('product/productD', {title: prod.title, data: prod, user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
            
        })

        this.get('/product/register', ["ADMIN", "PREMIUM"], async (req, res) => {
            try {
                
                res.render('product/registerProd', {title: 'Registrar nuevo producto', user: req.session?.user || req.user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })
    }
}