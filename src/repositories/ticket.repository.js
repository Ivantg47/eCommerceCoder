import TicketDTO from '../DTO/ticket.dto.js'
import logger from '../utils/logger.js'

export default class TicketRepository {

    constructor (dao) {
        this.dao = dao
    }

    get = async () => {
        try {
            
            const result = await this.dao.get()

            return result

        } catch (error) {

            logger.error(error.message);

        }
    }

    getById = async (id) => {
        try {
            
            const result = await this.dao.getById(id)

            return result

        } catch (error) {

            logger.error(error.message);

        }
    }

    create = async (data) => {
        try {
            
            const ticket = new TicketDTO(data)

            const result = await this.dao.create(ticket)

            return result
            
        } catch (error) {
            
            logger.error(error.message);
        }
    }

    delete = async (id) => {
        try {
            
            const result = await this.dao.delete(id)

            return result
            
        } catch (error) {
            
            logger.error(error.message);
        }
    }

    update = async(id, newTicket) => {

        try{
            
            const result = await this.dao.update(id, newTicket)

            return result
        
        } catch(error) {
            
            logger.error(error.message);

        }                        
    }
}