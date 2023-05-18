import { ticketModel } from "./models/ticket.model.js"



class TicketMongoManager{

    constructor(){
        
    }

    get = async () => {

        try{

            const data = await ticketModel.find().lean().exec()
            
            return data

        } catch(error) {
            
            throw error

        }
    }

    getTicketById = async(id) => {

        try{
            
            const data = await ticketModel.findOne({_id: id}).lean().exec()
            
            return data
        
        } catch(error) {
            
            throw error

        }    
    }

    create = async(ticket) => {

        try{

            const result = await ticketModel.create(ticket)
            
            return result

        } catch(error) {
            
            throw error
            
        }    
    }

    delete = async(id) => {

        try{
            const result = await ticketModel.deleteOne({_id: id})
            
            return result
        
        } catch(error) {

            throw error
        }                            
    }

    update = async(id, newTicket) => {

        try{
            const result = await ticketModel.findOneAndUpdate({_id: id}, newTicket)
            
            return result
        
        } catch(error) {
            
            throw error

        }                        
    }
}

const ticket = new TicketMongoManager()
export default ticket
