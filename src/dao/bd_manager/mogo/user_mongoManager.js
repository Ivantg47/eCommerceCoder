import logger from "../../../utils/logger.js"
import { userModel } from "./models/user.model.js"

class UserMongoManager {

    constructor () {
    }

    getUsers = async () => {

        try {
            
            const result = await userModel.find().lean().exec()

            return result

        } catch (error) {

            throw error

        }
    }

    getUserById = async (id) => {

        try {
            
            const result = await userModel.findById({_id: id}).populate('cart').lean().exec()

            return result

        } catch (error) {
            
            throw error

        }
    }

    getUserByEmail = async (username) => {

        try {
            
            const result = await userModel.findOne({email: username}).populate('cart').lean().exec()

            return result

        } catch (error) {
            
            throw error

        }
    }

    create = async (user) => {

        try {
            
            const result = await userModel.create(user)
            
            return result

        } catch (error) {
            
            throw error
            
        }
    }

    update = async (id, newUser) => {

        try {
            
            let result = await userModel.findOneAndUpdate({_id: id}, newUser, { upsert: true, returnOriginal: false })
            
            if (!result) {
                result = await userModel.findOneAndUpdate({email: id}, newUser, { upsert: true, returnOriginal: false })
            }

            return result

        } catch (error) {
            
            throw error
            
        }
    }

    delete = async (id) => {

        try {
            
            let result = await userModel.deleteOne({_id: id})
            
            if (result.deletedCount === 0) {
                result = await userModel.deleteOne({email: id})
            }
            
            return result.deletedCount !== 0

        } catch (error) {
            
            throw error
            
        }
    }
}

const user = new UserMongoManager()

export default user