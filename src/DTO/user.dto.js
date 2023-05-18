export default class UserDTO {

    constructor(user) {
        this.id = user.id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.password = user.password
        this.age = user.age
        this.cart = user.cart
        this.role = user.role || 'user'
        this.method = user.method
        this.documents = user.documents || []
        this.last_connection = user.last_connection
    }
    
}