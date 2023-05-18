import UserDTO from '../DTO/user.dto.js'
import { CartService } from "./index_repository.js"
import Mail from '../modules/mail.js'
import logger from '../utils/logger.js'
import storage from '../modules/storage.js'
import { deleteObject, ref } from 'firebase/storage'

export default class UserRepository {

    constructor (dao) {
        this.dao = dao
        this.mail = new Mail()
    }

    getUsers = async () => {
        
        const result = await this.dao.getUsers()
        
        if (!result) {
            return {code: 404, result: {status: "error", error: 'Not found'}}
        }

        result.forEach(user => {
            delete user.password
            delete user.cart
            if(user?._id) user.id = user._id
        });
        
        return {code: 200, result: {status: "success", payload: result} }
        
    }

    getUserById = async(id) => {
        
        const result = await this.dao.getUserById(id)

        if (!result) {
            return {code: 404, result: {status: "error", error: 'Not found'}}
        }
        
        if(result?._id) result.id = result._id

        return result
    }

    getUserByEmail = async(username) => {
        try {
            
            const result = await this.dao.getUserByEmail(username)
    
            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            
            if(result?._id) result.id = result._id
    
            return result
        
        } catch (error) {
            console.error(error);    
        }
    }

    addUser = async(user) => {
        
        const cart = await CartService.addCart()
        
        user.cart = cart.result.payload._id || cart.result.payload.id
        const data = new UserDTO(user)
        const date = new Date()
        data.last_connection = date.toString()
        const result = await this.dao.create(data)
        
        return result
    }

    deleteUser = async(username) => {

        let user = await this.dao.getUserById(username)
        if (!user) {
            user = await this.dao.getUserByEmail(username)
            if (!user) {
                return null
            }
        }
        

        const result = await this.dao.delete(username)

        if (result) {
            if (user.documents.length != 0) {
                for (let i = 0; i < user.documents.length; i++) {   
                    const fileUrl = user.documents[i].reference    
                    const fileRef = ref(storage, fileUrl);
                    await deleteObject(fileRef)    
                }
            }
            delete user.password
            delete user.documents
        }

        return {code: 200, result: {status: "success", message: 'Usuario eliminado', payload: user} }
    }

    updateUser = async(username, newUser) => {
        try {
            const result = await this.dao.update(username, newUser)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            delete result.password
            return {code: 200, result: {status: "success", message: 'Usuario actualizado', payload: result} }

        } catch (error) {
            logger.error(error.message)
        }
        
        return result
    }

    sendMail = async (username, html, subject) => {
        const user = await this.dao.getUserByEmail(username)

        if (user) {
            this.mail.send(user, subject, html)
        }
        
    }

    setUserRole = async(username) => {
        
        try {
            const user = await this.dao.getUserById(username)

            if (!user) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            
            if (user.documents.length === 3 && user.role == 'user') {
                user.role = 'premium'    
            } else if (user.role == 'premium') {
                user.role = 'user'
            } else if (user.role == 'admin'){
                return {code: 401, result: {status: "Error", message: 'Los usuarios con role de administrador no puede cambiar a premium'} }
            } else {
                return {code: 400, result: {status: "Error", message: `El usuario cuenta con ${user.documents.length} de los 3 documentos que se requieren para cambiar a premium`} }
            }
            
            
            const result = await this.dao.update(username, user)

            if (!result) {
                return {code: 404, result: {status: "error", error: 'Not found'}}
            }
            //logger.debug(JSON.stringify(result))
            delete result.password

            return {code: 200, result: {status: "success", message: 'Role actualizado', payload: result} }

        } catch (error) {
            logger.error(error.message)
            logger.error(error)
        }
    }

    limpiar = async () => {
        try {
            
            const users = await this.dao.getUsers()
            const usersDel = []
            
            if (!users) {
                return {code: 404, result: {status: "error", message: 'No hay usuarios registrados'} }    
            }

            for (let i = 0; i < users.length; i++) {
                const date1 = new Date(users[i].last_connection);
                const date2 = new Date()
                if ((date2 - date1)/86400000 > 2 && users[i].role != 'admin') {

                    const html = `<p>Estimado/a ${users[i].first_name} ${users[i].last_name},
                                    <br><br>
                                    Debido a un prolongado periodo de inactividad, su cuenta ha sido eliminada.
                                    <br><br>
                                    Para cualquier duda estamos a su disposición.
                                    <br><br>
                                    Atentamente,
                                    <br><br><br>
                                    Equipo de Ecommerce
                                    </p>`

                    const user = users[i]          
                    await this.dao.delete(users[i].id)
                    await this.sendMail(user.email, html, "Cuenta eliminada")  
                    await CartService.deleteCart(user.cart)
                    
                    if (user.documents.length != 0) {
                        for (let i = 0; i < user.documents.length; i++) {   
                            const fileUrl = user.documents[i].reference    
                            const fileRef = ref(storage, fileUrl);
                            await deleteObject(fileRef)    
                        }
                    }

                    delete user.password
                    delete user.documents
                    delete user.cart

                    usersDel.push(user)

                    logger.debug(`Usuario con id: ${user.id} fue eliminado`);

                }

                
            }

            return {code: 200, result: {status: "success", message: 'Usuarios sin actividad eliminados', payload: usersDel} }

        } catch (error) {
            logger.error(error.message)
            console.error(error);
        }
    }

}