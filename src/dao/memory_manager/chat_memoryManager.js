class ChatMemoryManager {

    constructor(){
        this.messages = []
    }

    getMessages = async () => {

        try {
            
            return this.messages

        } catch (error) {

            throw error

        }
    }

    addMessage = async (data) => {

        try {

            this.messages.push(data)
            
            return data

        } catch (error) {

            throw error

        }
    }

}

const chat = new ChatMemoryManager()

export default chat