import { messageModel } from "./models/chat.model.js"

class MessageMongoManager{

    getMessages = async () => {

        try {
            console.log('mongo');
            const data = await messageModel.find().lean().exec()

            return data

        } catch (error) {

            throw error

        }
    }

    addMessage = async (data) => {
        try {
            
            const result = await messageModel.create(data)

            return result

        } catch (error) {

            throw error

        }
    }
}

const mensajes = new MessageMongoManager()

export default mensajes 