export default class ProductDTO {

    constructor(product) {
        this.id = product.id || product.id || null
        this.title = product.title || ""
        this.description = product.description || ""
        this.price = Number(product.price) || 0
        this.thumbnail = product.thumbnail || ""
        this.code = product.code || ""
        this.stock = Number(product.stock) || 0
        this.category = product.category || ""
        this.status = product.status || true
        this.owner = product.owner || 'admin'
    }
    
}