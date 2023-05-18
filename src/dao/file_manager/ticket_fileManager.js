import fs from 'fs'
import __dirname from '../../utils.js'

class TicketFileManager {

    constructor(){
        this.path = __dirname + '/json/ticket.json'
        this.init()
    }

    init = () => {
        try {

            let file = fs.existsSync(this.path,'utf-8')

            if (!file) {
                fs.writeFileSync(this.path,JSON.stringify([]))
            }

            return null

        } catch(error) {
            throw error
        }
    }

    get = async () => {

        try{

            const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
            return data

        } catch(error) {
            
            throw error

        }
    }

    getId = async() => {
        try{
            
            const tickets = await this.get()
            const cont = tickets.length

            return (cont > 0) ? tickets[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getTicketById = async(id) => {

        try{
            
            const tickets = await this.get()

            const ticket = tickets.find(t => {
                return t.id === Number(id)
            })
            
            return ticket
        
        } catch(error) {
            
            throw error

        }    
    }

    create = async(ticket) => {

        try{

            const tickets = await this.get()
            
            ticket.id = await this.getId()

            tickets.push(ticket)

            await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, 2))
            
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
            const tickets = await this.get()

            const filtro = tickets.filter((ticket) => ticket.id != id)

            fs.promises.writeFile(this.path, JSON.stringify(filtro, null, 2))
            
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
            const tickets = await this.get()
            tickets.map(ticket => ticket.id === id ? ticket : newTicket)
            
            fs.promises.writeFile(this.path, JSON.stringify(filtro, null, 2))
            
            return 'Ticket modificado'
        
        } catch(error) {
            
            throw error

        }                        
    }
}

const ticket = new TicketFileManager()

export default ticket