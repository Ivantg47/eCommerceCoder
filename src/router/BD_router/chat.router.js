import express from 'express'
import { mensajes } from '../../dao/bd_manager/chatManagerBD.js';
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        
        const messages = await mensajes.getMessages()
        if (!messages) {
            return res.status(404).send("not found")
        }
        return res.status(200).send(messages)
    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/', async (req, res, next) => {
    try {
        let mensaje = req.body
        //console.log(mensaje);
        const message = await mensajes.addMessage(mensaje)
        //console.log(await mensajes.getMessages());
        req.app.get('io')
            .sockets.emit('mensaje', await mensajes.getMessages())

        return res.status(message.status).send(message.message)
        //return res.status(200).send(message)

    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router