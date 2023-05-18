import ChatDTO from '../DTO/chat.dto.js'
import logger from '../utils/logger.js'

export default class ChatRepository {

    constructor (dao) {
        this.dao = dao
    }

    getMessages = async () => {

        try {
            
            const result = await this.dao.getMessages()
            
            if (!result || result.length === 0) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }

            return {code: 200, result: {status: "success", payload: result} }

        } catch (error) {

            logger.error(error.message);
            return error

        }
    }

    addMessage = async (data) => {
        try {
            const message = new ChatDTO(data)

            if (!message.user || !message.message) {
                return {status: 400, message: 'Falta llenar campos'}
            }
            
            const result = await this.dao.addMessage(message)

            return {status: 200, message: 'Mensaje enviado', payload: result}

        } catch (error) {

            logger.error(error.message);
            return error
        }
    }
}