export default class TicketDTO {

    constructor(ticket) {
        this.code = Date.now() + Math.floor(Math.random()*10000 + 1)
        this.purchase_datetime = Date.now()
        this.amount = ticket.amount
        this.purchaser = ticket.purchaser || null
    }
    
}