import fs from 'fs'
import __dirname from '../../utils.js'
import ProductService from './product_fileManager.js'

class CartFileManager {

    constructor(){
        this.path = __dirname + '/json/carritos.json'
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

    getCarts = async() => {
        try{

            const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
            return data

        } catch(error) {
            
            throw error

        }
    }

    getId = async() => {
        try{
            
            const carts = await this.getCarts()
            const cont = carts.length

            return (cont > 0) ? carts[cont-1].id + 1 : 1

        } catch(error) {
            
            throw error

        }
    }
    
    getCartById = async (id) => {
        try{
            
            const carts = await this.getCarts()
              
            const cart = carts.find(c => {
                return c.id === Number(id)
            })
            
            if (cart.products) {

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
            
            const carts = await this.getCarts()

            let cart = {
                id: await this.getId(),
                products: []
            }

            carts.push(cart)

            // await fs.promises.writeFile(this.path, JSON.stringify(carts))
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

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
            
            const carts = await this.getCarts()

            const filtro = carts.filter((cart) => cart.id != id)
            
            // fs.promises.writeFile(this.path, JSON.stringify(filtro))
            fs.promises.writeFile(this.path, JSON.stringify(filtro, null, 2))

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
            
            const carts = await this.getCarts()
            
            carts.map(cart => {
                if (cart.id === Number(cid)){
                    cart.products = prods
                }
            })
            
            cart.products = prods
            
            //await fs.promises.writeFile(this.path, JSON.stringify(carts))
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

            return cart

        } catch (error) {
            
            throw error

        }
    }
    
    addProdCart = async(cid, pid, quantity) => {
        try{
            const carts = await this.getCarts()

            const iC = carts.map(uCart => uCart.id).indexOf(Number(cid))
            
            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.product).indexOf(Number(pid))
            
            if (iP !== -1) {
                carts[iC].products[iP].quantity += quantity
            } else {
                carts[iC].products.push({
                    product: Number(pid),
                    quantity: quantity
                })
            }

            // await fs.promises.writeFile(this.path, JSON.stringify(carts))
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

            return carts[iC]
        
        } catch(error) {
            
            throw error

        } 
    }

    deleteProdCart = async(cid, pid) => {
        try{
            
            cid = Number(cid)
            pid = Number(pid)

            const carts = await this.getCarts()

            const iC = carts.map(uCart => uCart.id).indexOf(cid)

            
            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.product).indexOf(pid)
            
            if (iP === -1) {
                return null 
            } 

            carts[iC].products = carts[iC].products.filter((prod) => prod.product != pid)
            
            // await fs.promises.writeFile(this.path, JSON.stringify(carts))
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

            return 'Producto eliminado'
        
        } catch(error) {
            
            throw error

        } 
    }

    updateProdCart = async(cid, pid, quantity) => {
        try{
            
            cid = Number(cid)
            pid = Number(pid)

            const carts = await this.getCarts()

            const iC = carts.map(uCart => uCart.id).indexOf(cid)

            if(iC === -1){
                return null
            }
            
            const iP = carts[iC].products.map(uProd => uProd.product).indexOf(pid)
            
            if (iP === -1) {
                return null 
            } 

            carts[iC].products.map(prod => {
                if(prod.product===pid) {
                    prod.quantity = quantity
                }
            })
            
            // await fs.promises.writeFile(this.path, JSON.stringify(carts))
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

            return carts[iC]
        
        } catch(error) {
            
            throw error

        } 
    }
}

const carrito = new CartFileManager()

export default carrito