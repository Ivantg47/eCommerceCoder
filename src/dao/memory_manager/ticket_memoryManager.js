class TicketMemoryManager {

    constructor(){
        this.tickets = []
    }

    get = async () => {

        try{

            return this.tickets

        } catch(error) {
            
            throw error

        }
    }

    getId = async() => {
        try{
            
            const cont = this.tickets.length

            return (cont > 0) ? this.tickets[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getTicketById = async(id) => {

        try{
            
            const ticket = this.tickets.find(t => {
                return t.id === Number(id)
            })
            
            return ticket
        
        } catch(error) {
            
            throw error

        }    
    }

    create = async(ticket) => {

        try{

            ticket.id = await this.getId()
            this.tickets.push(ticket)

            return ticket

        } catch(error) {
            
            throw error
            
        }    
    }

    delete = async(id) => {

        try{
            
            if (!await this.getTicketById(id)) {                
                return null
            }
            
            this.tickets = this.tickets.filter((ticket) => ticket.id != id)

            return 'Ticket eliminado'
        
        } catch(error) {

            throw error
        }                            
    }

    update = async(id, newTicket) => {

        try{
            if (!await this.getTicketById(id)) {                
                return null
            }
            
            this.tickets.map(ticket => ticket.id === id ? ticket : newTicket)
            
            return 'Ticket modificado'
        
        } catch(error) {
            
            throw error

        }                        
    }
}

const ticket = new TicketMemoryManager()

export default ticket