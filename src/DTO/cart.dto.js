export default class CartDTO {

    constructor(cart) {
        
        this.id = cart?.id || null
        this.products = cart?.products || []
    }
    
}