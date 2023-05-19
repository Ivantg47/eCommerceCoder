import { ChatService } from "../../repositories/index_repository.js";
import MiRouter from "../router.js";

export default class ChatRouter extends MiRouter {

    init () {

        this.get('/', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                
                const messages = await ChatService.getMessages()

                if (!messages) {
                    return res.status(404).send("Not found")
                }
                return res.status(200).send(messages)
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })

        this.post('/', ["USER", "PREMIUM"], async (req, res, next) => {
            try {
                
                let mensaje = req.body
                
                const message = await ChatService.addMessage(mensaje)
                
                req.app.get('io')
                    .sockets.emit('messageLogs', await ChatService.getMessages())
        
                return res.status(message.status).send(message.message)
        
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })
    }
}