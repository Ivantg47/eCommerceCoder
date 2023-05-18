import fs from 'fs'
import __dirname from '../../utils.js'
import logger from '../../utils/logger.js'

class UserFileManager {

    constructor(){
        this.path = __dirname + '/json/user.json'
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

    getUsers = async() => {

        try{
            
            const data =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            
            return data

        } catch(error) {
            throw error
        }
    }

    getId = async() => {
        try{
            
            const users = await this.getUsers()
            const cont = users.length

            return (cont > 0) ? users[cont-1].id + 1 : 1

        } catch(error) {
            throw error
        }
    }

    getUserById = async(id) => {
        try{
            
            const users = await this.getUsers()
            const user = users.find(u => {
                return u.id === Number(id)
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }

    getUserByEmail = async(email) => {
        try{
            
            const users = await this.getUsers()
            
            const user = users.find(u => {
                return u.email === email
            })
            
            return user
        
        } catch(error) {
            throw error
        } 
    }
    
    create = async(user) => {
        try{
            
            const users = await this.getUsers()

            user.id = await this.getId()
            users.push(user)

            await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2))

            return user
                    
        } catch(error) {
            throw error
        }
    }
    
    delete = async(email) => {

        try {

            let user = await this.getUserByEmail(email)

            if (!user) {   
                user = await this.getUserById(email)
                if (!user) {            
                    return null
                }
            }

            const users = await this.getUsers()

            let filtro = users.filter((user) => user.email != email)
            filtro = users.filter((user) => user.id != email)

            await fs.promises.writeFile(this.path, JSON.stringify(filtro, null, 2))
            
            return 'Usuaio eliminado'

        } catch (error) {
            throw error
        }     
    }

    update = async(id, newdata) => {

        try {

            let user = await this.getUserByEmail(id)

            if (!user) {   
                user = await this.getUserById(id)
                if (!user) {            
                    return null
                }
            }
            
            const users = await this.getUsers()
            
            for (const prop in newdata) {
                user[prop] = newdata[prop]         
            }

            // users.map(_user => _user.id === id ? user : _user)
            for (let i = 0; i < users.length; i++) {
                if (users[i].id == id) {
                    users[i] = user
                }
                
            }
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2))
            
            return user

        } catch (error) {
            throw error
        }     
    }
}

const user = new UserFileManager()

export default user