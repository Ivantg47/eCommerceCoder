import fs from 'fs'


class ProductManager{

    constructor(path){
        this.path = path
    }

    getProducts = async() => {

        try{

            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const prod = JSON.parse(data)

                return prod
            }

            return []

        } catch(error) {
            console.log(error);
        }
    }

    getId = async() => {

        try{
            
            const prods = await this.getProducts()
            const cont = prods.length

            return (cont > 0) ? prods[cont-1].id + 1 : 1

        } catch(error) {
            console.log(error);
        }
    }

    getProductById = async(id) => {

        try{
            
            const prods = await this.getProducts()
            const prod = prods.find(product => {
                return product.id === Number(id)
            })
            //console.log(typeof prod.price);
            return prod
        
        } catch(error) {
            console.log(error);
        }    
    }

    validateCode = async(code) => {

        try{
            
            const prods = await this.getProducts()

            return typeof(prods.find(product => {
                return product.code === code
                })) === "undefined" //false: en uso -- true: libre
        
        } catch(error) {
            console.log(error);
        }        
    }

    addProduct = async(prod) => {

        try{
            
            const prods = await this.getProducts()

            if (!prod.title || !prod.description || !prod.description || !prod.price || !prod.thumbnail || !prod.code || !prod.stock || !prod.category) {
                return {success: false, product: 'Falta llenar campos'}
            }

            if (!await this.validateCode(prod.code)) {
                return {success: false, product: 'Codigo en uso'}
            }
            prod.id =  await this.getId()
            prod.status = true
            prod.price = Number(prod.price)
            prod.stock = Number(prod.stock)
            prods.push(prod)
            await fs.promises.writeFile(this.path, JSON.stringify(prods))

            return {success: true, product: "Producto creado"}
                    
        } catch(error) {
            console.log(error);
        }    
    }

    deleteProduct = async(id) => {

        try{
            
            const prods = await this.getProducts()

            if (!await this.getProductById(id)) {                
                return null
            }
            
            const filtro = prods.filter((prod) => prod.id != id)

            fs.promises.writeFile(this.path, JSON.stringify(filtro))
            
            return {success: true, product: 'Producto eliminado'}
        
        } catch(error) {
            console.log(error);
        }                            
    }

    updateProduct = async(pid, newProd) => {

        try{
            
            const prods = await this.getProducts()

            const i = prods.map(uProd => uProd.id).indexOf(pid)

            if(i === -1){
                return null
            }
            const g = (newProd.code == null || (await this.validateCode(newProd.code) && i != prods.map(uProd => uProd.code).indexOf(newProd.code)))
            const h = (i === prods.map(uProd => uProd.code).indexOf(newProd.code) || newProd.code == null)

            if(!(g || h)){
                return {success: false, product: 'Codigo en uso'}
            }
   
            if (!(typeof newProd.id === "undefined" || prods[i].id === newProd.id)) {
                return {success: false, product: 'No se puede cambiar el id'}
            }
            for (const j of Object.keys(newProd)) {
                console.log(`vp: ${prods[i][j]}`);
                console.log(`np: ${newProd[j]}`);
                prods[i][j] = newProd[j]
            }
            
            fs.promises.writeFile(this.path, JSON.stringify(prods))

            return {success: true, product: 'Producto actualizado'}
        
        } catch(error) {
            console.log(error);
        }                        
    }

}

const producto = new ProductManager('./src/json/producto.json')

export default producto
