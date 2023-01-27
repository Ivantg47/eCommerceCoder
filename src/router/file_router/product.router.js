
import express from 'express'
const router = express.Router()
import producto from '../dao/file_manager/productManager.js'
import uploader from '../dao/multer.js'

router.get('/', async (req, res) => {
    try {
        const prod = await producto.getProducts()
        if (!prod) {
            return res.status(404).send("not found")
        }
        if (req.query.limit != null) {
            return res.status(200).send(prod.slice(0,req.query.limit))
        }else{
            return res.status(200).send(prod)
        }
    } catch (error) {
        console.log(error);
    }

})

router.get('/:pid', async (req, res) => {
    try {
        const prod = await producto.getProductById(req.params.pid)
        if (!prod) {
            return res.status(404).send('not found') 
        }
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.post('/', uploader.array('thumbnail'), async (req, res) => {
    try {
        let product = req.body

        if(req.files.length === 0) {
            product.thumbnail = ['/img/noimage.jpg']
        } else {
            product.thumbnail = req.files.map(file => file.path.split('\\').slice(1).join('\\'))
        }

        const prod = await producto.addProduct(product)
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const prod = await producto.updateProduct(parseInt(req.params.id), req.body)
        
        if (!prod) {
            return res.status(404).send('not found')
        }
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        
        const prod = await producto.deleteProduct(req.params.id)
        if (!prod) {
            return res.status(404).send('not found')
        }
        
        return res.status(200).send(prod)
    } catch (error) {
        console.log(error);
    }
})

export default router