import express from 'express'
const router = express.Router()
import carrito from '../../dao/bd_manager/cartManagerBD.js'

router.get('/', async (req, res, next) => {
    try {
        const cart = await carrito.getCarts()
        if (!cart) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(cart)
    } catch (error) {
        console.log(error);
    }
})

router.get('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params
        const cart = await carrito.getCartById({_id: cid})
        
        return res.status(cart.status).send(cart.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/', async (req, res, next) => {
    try {
        const cart = await carrito.addCart()
        //console.log(cart);
        return res.status(200).send(cart)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid } = req.params
        const { pid } = req.params
        //console.log(req.body);
        const cart = await carrito.addProdCart({_id: cid}, {_id: pid}, req.body)
    
        return res.status(cart.status).send(cart.message)
        //return res.status(200).send('hola')
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.delete('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params
        //console.log(cid);
        const cart = await carrito.deleteCart({__id: cid})

        return res.status(cart.status).send(cart.message)

    } catch(error) {
        console.log(error);
        return next()
    }
})

router.delete('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid } = req.params
        const { pid } = req.params
        //console.log(cid, pid);
        const cart = await carrito.deleteProdCart({_id: cid}, pid)
    
        return res.status(cart.status).send(cart.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.put('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params
        console.log(req.body);
        const cart = await carrito.updateCart({_id: cid}, req.body)
    
        return res.status(cart.status).send(cart.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.put('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid } = req.params
        const { pid } = req.params

        const cart = await carrito.updateProdCart({_id: cid}, pid, req.body)
    
        return res.status(cart.status).send(cart.message)
    } catch (error) {
        console.log(error);
        return next()
    }
})
export default router
