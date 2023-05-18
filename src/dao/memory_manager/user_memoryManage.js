class UserMemoryManager {

    constructor(){
        this.users = []
    }

    getUsers = async() => {

        try{
            
            return this.users

        } catch(error) {
            throw error
        }
    }

    getId = async() => {
        try{
            
            const cont = this.users.length

            return (cont > 0) ? this.users[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getUserById = async(id) => {
        try{
            
            const user = this.users.find(u => {
                return u.id === Number(id)
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }

    getUserByEmail = async(email) => {
        try{
            
            const user = this.users.find(u => {
                return u.email === email
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }
    
    create = async(user) => {
        try{
            
            user.id = await this.getId()
            this.users.push(user)

            return user
                    
        } catch(error) {
            throw error
        }
    }
    
    delete = async(email) => {

        try {
            if (!await this.getUserByEmail(email)) {                
                return null
            }

            this.users = this.users.filter((user) => user.email != email)

            return 'Usuaio eliminado'

        } catch (error) {

            throw error
        }     
    }

    update = async(email, newdata) => {

        try {

            if (!await this.getUserByEmail(email)) {                
                return null
            }

            if (email !== newdata.email) {
                return 'No se puede modificar el correo'
            }

            this.users.map(user => user.email === email ? user : newdata)

            return 'Usuario modificado'

        } catch (error) {
            throw error
        }     
    }
}

const user = new UserMemoryManager()

export default user