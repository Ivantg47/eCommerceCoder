
import express from 'express'
const router = express.Router()
import producto from '../../dao/bd_manager/productManagerBD.js'
import uploader from '../../dao/multer.js'

router.get('/', async (req, res, next) => {
    try {
        let pagination = {
            page: parseInt(req.query?.page) || 1,
            limit: parseInt(req.query?.limit) || 10
        }
        const filter = req.query?.query || req.body?.query

        let query = {}

        if(req.query.sort) pagination.sort = {price: req.query.sort}
        if(filter) query = {title: {$regex: `/${filter}/i`}}
        if(req.query.category) query = {category: req.query.category}
        if(req.query.status) query = {status: req.query.status}

        //console.log('>>', pagination, query);
        
        const prod = await producto.getProducts(query, pagination)
        //console.log(prod);
        if (!prod.isValid) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(prod)

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const prod = await producto.getProductById({_id: pid})

        return res.status(prod.status).send(prod.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/', uploader.array('thumbnail'), async (req, res, next) => {
    try {
        let product = req.body
        //console.log(product);
        if(req.files.length === 0) {
            product.thumbnail = ['/img/noimage.jpg']
        } else {
            console.log(product.thumbnail);
            product.thumbnail = req.files.map(file => file.path.split('\\').slice(0).join('\\'))
            console.log(product.thumbnail);
        }
        
        const prod = await producto.addProduct(product)
        //console.log(prod);
        if (prod.success) {
            return res.status(200).send(prod)
        } else {
            
            return res.status(400).send(prod)
        }
        
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.put('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        const newProd = req.body

        const prod = await producto.updateProduct({_id: pid}, newProd)
        
        return res.status(200).send(prod)

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.delete('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params
        console.log(pid);
        const prod = await producto.deleteProduct({_id: pid})
        
        return res.status(prod.status).send(prod)
        
    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router