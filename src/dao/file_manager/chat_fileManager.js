import fs from 'fs'
import __dirname from '../../utils.js'

class ChatFileManager {

    constructor(){
        this.path = __dirname + '/json/chat.json'
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

    getMessages = async () => {

        try {
            
            const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))

            return data

        } catch (error) {

            throw error

        }
    }

    addMessage = async (data) => {

        try {

            const messages = await this.getMessages()
            
            messages.push(data)

            const result = await fs.promises.writeFile(this.path, JSON.stringify(messages))

            return result

        } catch (error) {

            throw error

        }
    }

}

const chat = new ChatFileManager()

export default chat