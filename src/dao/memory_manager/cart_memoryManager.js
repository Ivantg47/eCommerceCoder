import ProductService from './product_memoryManager.js'

class CartMemoryManager {

    constructor(){
        this.carts = []
    }

    getCarts = async() => {
        try{

            return this.carts

        } catch(error) {
            
            throw error

        }
    }

    getId = async() => {
        try{
            
            const cont = this.carts.length

            return (cont > 0) ? this.carts[cont-1].id + 1 : 1

        } catch(error) {
            
            throw error

        }
    }
    
    getCartById = async(id) => {
        try{
            
            const cart = this.carts.find(c => {
                return c.id === Number(id)
            })

            if (cart) {

                await Promise.all(cart.products.map(async prod => {
                    return prod.product = await ProductService.getProductById(prod.product)
                }));
                
            }
            
            return cart
        
        } catch(error) {
            
            throw error

        } 
    }
    
    addCart = async() => {
        try{
            
            let cart = {
                id: await this.getId(),
                products: []
            }

            this.carts.push(cart)

            return cart
            
        } catch(error) {
            
            throw error

        }
    }
    
    deleteCart = async(id) => {
        try {

            if (!await this.getCartById(id)) {                
                return null
            }
            
            this.carts = this.carts.filter((cart) => cart.id != id)

            return 'Carrito eliminado'

        } catch (error) {
            
            throw error

        }
    }
    
    updateCart = async(cid, prods) => {
        try {
            
            const cart = await this.getCartById(cid)
            
            if (!cart) {                
                return null
            }
            
            this.carts.map(cart => {
                console.log(cart);
                if (cart.id === Number(cid)){
                    cart.products = prods
                }
            })

            return cart

        } catch (error) {
            
            throw error

        }
    }
    
    addProdCart = async(cid, pid) => {
        try{
            
            const iC = this.carts.map(uCart => uCart.id).indexOf(Number(cid))
            
            if(iC === -1){
                return null
            }
            
            const iP = this.carts[iC].products.map(uProd => uProd.id).indexOf(Number(pid))
            
            if (iP !== -1) {
                
                this.carts[iC].products[iP].quantity += quantity
            } else {
                this.carts[iC].products.push({
                    id: Number(pid),
                    quantity: quantity
                })
            }
            
            return this.carts[iC]
        
        } catch(error) {
            
            throw error

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{

            cid = Number(cid)
            pid = Number(pid)

            const iC = this.carts.map(uCart => uCart.id).indexOf(cid)
            
            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.id).indexOf(pid)
            
            if (iP === -1) {
                return null 
            } 
    
            this.carts[iC].products = this.carts[iC].products.filter((prod) => prod.id != pid)
            
            return 'Producto eliminado'
        
        } catch(error) {
            
            throw error

        } 
    }

    updateProdCart = async(cid, pid, quantity) => {
        try{
            
            cid = Number(cid)
            pid = Number(pid)

            const iC = this.carts.map(uCart => uCart.id).indexOf(cid)

            if(iC === -1){
                return null
            }
            
            const iP = this.carts[iC].products.map(uProd => uProd.product).indexOf(pid)
            
            if (iP === -1) {
                return null 
            } 

            this.carts[iC].products.map(prod => {
                if(prod.product===pid) {
                    prod.quantity = quantity
                }
            })
            
            return this.carts[iC]
        
        } catch(error) {
            
            throw error

        } 
    }

}

const carrito = new CartMemoryManager()

export default carrito