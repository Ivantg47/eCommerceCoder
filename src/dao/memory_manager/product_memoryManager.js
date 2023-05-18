class ProductMemoryManager {

    constructor(){
        this.products = []
    }

    getProducts = async() => {

        try{
            
            return this.products

        } catch(error) {
            throw error
        }
    }

    getPaginate = async(query, pagination) => {

        try{

            let index, limit
            if (pagination.page == 1) {
                index = 0
                limit = pagination.limit
            } else {
                index = pagination.page * pagination.limit - pagination.limit
                limit = index + pagination.limit
            }
            let total = Math.ceil(this.products.length / pagination.limit)

            const prods = {
                isValid: !(pagination.page <= 0 || pagination.page>total || this.products.length === 0),
                totalProds: this.products.length,
                payload: this.products.slice(index, limit),
                totalPages: total, 
                page: pagination.page, 
                hasPrevPage: pagination.page !== 1, 
                hasNextPage:  pagination.page < total
            }

            return prods

        } catch(error) {
            throw error
        }
    }

    getId = async() => {

        try{

            const cont = this.products.length
            
            return (cont > 0) ? this.products[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getProductById = async(id) => {

        try{
            console.log('busca', id);
            const prod = this.products.find(product => {
                return product.id === Number(id)
            })
            
            if (!prod) {
                return null
            }
            console.log(prod);
            return prod
        
        } catch(error) {
            throw error
        }    
    }

    validateCode = async(code) => {

        try{
            
            return typeof(this.products.find(product => {
                return product.code === code
                })) === "undefined" //false: en uso -- true: libre
        
        } catch(error) {
            throw error
        }        
    }

    addProduct = async(prod) => {

        try{

            if (!prod.title || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return 'Falta llenar campos'
            }

            if (!await this.validateCode(prod.code)) {
                return 'Codigo en uso'
            }
            prod.id =  await this.getId()

            this.products.push(prod)

            return prod
                    
        } catch(error) {
            throw error
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            if (!await this.getProductById(id)) {                
                return null
            }
            
            this.products = this.products.filter((prod) => prod.id != id)

            return 'Producto eliminado'
        
        } catch(error) {
            throw error
        }                            
    }

    updateProduct = async(pid, newProd) => {
        try{
            
            const prod = await this.getProductById(pid)
            
            if (JSON.stringify(newProd) === "{}") {
                return {status: 400, error: 'No introdujeron datos para modificar' }
            }
            
            if(!newProd.id || newProd.id == pid) {
                if (await this.validateCode(newProd.code) || newProd.code == prod.code) {
                    for (let prop in newProd) {
                        prod[prop] = newProd[prop]
                    }
                    
                    this.products.map(_prod => _prod.id===pid ? prod : _prod )
                    
                    return prod
                }

                return {status: 400, error: 'Codigo en uso' }

            } else {
                return {status: 400, error: 'El id no se pude modificar' }
            }

        } catch(error) {
            throw error
        }                        
    }

    purchase = async(pid, quantity) => {
        try {
            
            const prod1 = await this.getProductById(pid)

            if (!prod1) {
                return null
            }

            this.products.map(prod =>{ 
                if(prod.id===pid) {
                    prod.stock += quantity 
                    prod1 = prod
                }
            })

            return prod1

        } catch (error) {
            
            throw error

        }
    }

}

const producto = new ProductMemoryManager()

export default producto
