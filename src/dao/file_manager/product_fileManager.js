import fs from 'fs'
import __dirname from '../../utils.js'

class ProductFileManager {

    constructor(){
        this.path = __dirname + '/json/producto.json'
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

    getProducts = async() => {

        try{
            
            const data =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            return data

        } catch(error) {
            throw error
        }
    }

    getPaginate = async(query, pagination) => {

        try{
            
            const data =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            let index, limit
            if (pagination.page == 1) {
                index = 0
                limit = pagination.limit
            } else {
                index = pagination.page * pagination.limit - pagination.limit
                limit = index + pagination.limit
            }
            let total = Math.ceil(data.length / pagination.limit)

            const prods = {
                isValid: !(pagination.page <= 0 || pagination.page>total || data.length === 0),
                totalProds: data.length,
                payload: data.slice(index, limit),
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
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const cont = prods.length
            
            return (cont > 0) ? prods[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getProductById = async(id) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const prod = prods.find(product => {
                return product.id === Number(id)
            })
            
            if (!prod) {
                return null
            }
            return prod
        
        } catch(error) {
            throw error
        }    
    }

    validateCode = async(code) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            return typeof(prods.find(product => {
                return product.code === code
                })) === "undefined" //false: en uso -- true: libre
        
        } catch(error) {
            throw error
        }        
    }

    addProduct = async(prod) => {

        try{
            
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            if (!prod.title || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return 'Falta llenar campos'
            }

            if (!await this.validateCode(prod.code)) {
                return 'Codigo en uso'
            }
            prod.id =  await this.getId()
            
            prods.push(prod)

            // await fs.promises.writeFile(this.path, JSON.stringify(prods))
            await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 2))

            return prod
                    
        } catch(error) {
            throw error
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prod = await this.getProductById(id)

            if (!prod) {                
                return null
            }

            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
            const filtro = prods.filter((prod) => prod.id != id)

            //await fs.promises.writeFile(this.path, JSON.stringify(filtro))
            await fs.promises.writeFile(this.path, JSON.stringify(filtro, null, 2))
            
            return prod
        
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
            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
            if(!newProd.id) {
                if (await this.validateCode(newProd.code) || newProd.code == prod.code) {
                    for (let prop in newProd) {
                        prod[prop] = newProd[prop]
                    }
                    
                    prods.map(_prod => _prod.id===pid ? prod : _prod )
                                
                    // await fs.promises.writeFile(this.path, JSON.stringify(prods))
                    await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 2))

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
            
            let prod1 = await this.getProductById(pid)
            
            if (!prod1) {
                return null
            }

            const prods = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            prods.map(prod =>{ 
                if(prod.id == pid) {
                    prod.stock += quantity 
                    prod1 = prod
                }
            })

            //await fs.promises.writeFile(this.path, JSON.stringify(prods))
            await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 2))
            
            return prod1

        } catch (error) {
            
            throw error

        }
    }

}

const producto = new ProductFileManager()

export default producto
